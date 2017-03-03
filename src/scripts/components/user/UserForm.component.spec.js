/* eslint-disable no-unused-expressions */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-duplicates */

import React from 'react'
import Promise from 'bluebird'
import { reduxForm, reducer as formReducer } from 'redux-form'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(chaiEnzyme())
chai.use(sinonChai)
import { getIntlPropsMock, getReudxFormPropsMock } from '../../../../test/helpers'


// contexte
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { IntlProvider } from 'react-intl'

// component
import { UserForm } from './UserForm.component'
import userValidator from './user.validator'
import userTheme from './user.scss'

describe('<UserForm> component', () => {
  let props
  let intlProvider

  beforeEach(() => {
    props = {
      // component
      ...{
        theme: userTheme,
        onCancel: () => {},
        onSubmitUserFailure: () => {},
        onSubmitUserForm: () => {},
        onSubmitUserSuccess: () => {},
        onUserEditCancel: () => {},
        onUserSelect: () => {}
      },
      // redux-form
      ...getReudxFormPropsMock(),
      // intl
      ...getIntlPropsMock()
    }
    intlProvider = new IntlProvider({ locale: 'en' }, {})
  })

  describe('state', () => {
    it('should init state', () => {
      // Given
      const nextProps = {
        ...props,
        ...{
          asyncValidate: () => Promise.resolve(),
          handleSubmit: fct => fct
        }
      }
      const { context } = intlProvider.getChildContext()

      // When
      const component = shallow(
        <UserForm {...nextProps}/>,
        { context }
      )

      // Then
      expect(component.state().checked).to.be.false
      expect(component.state().edited).to.be.true
    })

    it('should init state with checked prop', () => {
      // Given
      const nextProps = {
        ...props,
        ...{
          checked: true,
          asyncValidate: () => Promise.resolve(),
          handleSubmit: fct => fct
        }
      }
      const { context } = intlProvider.getChildContext()

      // When
      const component = shallow(
        <UserForm {...nextProps}/>,
        { context }
      )

      // Then
      expect(component).to.have.state('checked').to.be.true
      expect(component).to.have.state('edited').to.be.true
    })
  })

  describe('form', () => {
    let store
    let DecoratedUserForm
    let windowBackup

    beforeEach(() => {
      store = createStore(combineReducers({
        form: formReducer
      }))
      DecoratedUserForm = reduxForm({ form: 'userForm', userValidator })(UserForm)
      // need to mock event listener du to react-toolbox input
      // see https://github.com/react-toolbox/react-toolbox/blob/da3291be74037188f748b3ab0a3148d1b01ede79/components/input/Input.js#L69
      windowBackup = {
        addEventListener: global.window.addEventListener,
        removeEventListener: global.window.removeEventListener
      }
      global.window.addEventListener = () => {}
      global.window.removeEventListener = () => {}
    })

    afterEach(() => {
      global.window.addEventListener = windowBackup.addEventListener
      global.window.removeEventListener = windowBackup.removeEventListener
    })

    it('should disable buttons if disabled prop', () => {
      // Given
      const nextProps = {
        ...props,
        ...{
          disabled: true
        }
      }
  
      // When
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <DecoratedUserForm {...nextProps}/>
          </IntlProvider>
        </Provider>
      )
  
      // Then
      component.find('button').forEach(node => {
        expect(node).to.have.prop('disabled').to.be.true  
      })
    })

    it('should init required', () => {
      // Given

      // When
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <DecoratedUserForm {...props}/>
          </IntlProvider>
        </Provider>
      )

      // Then
      expect(component.find('input[name="userName"]')).to.have.prop('required').to.be.false
      expect(component.find('input[name="lastName"]')).to.have.prop('required').to.be.false
      expect(component.find('input[name="userName"]')).to.have.prop('required').to.be.false
      expect(component.find('input[name="email"]')).to.have.prop('required').to.be.true
    })

    it('should init required if edition and ', () => {
      // Given
      const nextProps = {
        ...props,
        ...{
          edition: true
        }
      }

      // When
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <DecoratedUserForm {...nextProps}/>
          </IntlProvider>
        </Provider>
      )

      // Then
      expect(component.find('input[name="userName"]')).to.have.prop('required').to.be.true
      expect(component.find('input[name="lastName"]')).to.have.prop('required').to.be.true
      expect(component.find('input[name="userName"]')).to.have.prop('required').to.be.true
      expect(component.find('textarea[name="sshKeyPublic"]')).to.be.present()
      expect(component.find('input[name="password"]')).to.be.present()
      expect(component.find('input[name="passwordConfirm"]')).to.be.present()
      expect(component.find('input[name="email"]')).to.have.prop('required').to.be.true
    })
    
  })

  describe('event handlers', () => {
    let store
    let DecoratedUserForm

    beforeEach(() => {
      store = createStore(combineReducers({
        form: formReducer
      }))
      DecoratedUserForm = reduxForm({ form: 'userForm', userValidator })(UserForm)
    })

    it('should handle creation submit', () => {
      // Given
      const email = 'email@user.com'
      const nextProps = {
        ...props,
        ...{
          creation: true,
          edition: false,
          onSubmitUserForm: sinon.stub()
        }
      }
      nextProps.onSubmitUserForm.resolves()
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <DecoratedUserForm {...nextProps}/>
          </IntlProvider>
        </Provider>
      )

      // When
      const fieldEmail = component.find('input[name="email"]')
      fieldEmail.simulate('change', { target: { value: email } })
      component.find('form[name="userForm"]').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(fieldEmail).to.have.value(email)
      expect(nextProps.onSubmitUserForm).to.have.callCount(1)
      expect(nextProps.onSubmitUserForm).to.have.been.calledWith({
        id: '',
        email: email,
        firstName: '',
        lastName: '',
        password: '',
        sshKeyPublic: '',
      })
    })

    it('should handle edition submit', () => {
      // Given
      const firstName = 'firstName'
      const lastName = 'lastName'
      const email = 'email@user.com'
      const sshKey = 'sshKeyPublic'
      const password = 'password'
      const nextProps = {
        ...props,
        ...{
          creation: false,
          edition: true,
          submitting: false,
          disabled: false,
          onSubmitUserForm: sinon.stub(),
          user: {
            id: '1'
          }
        }
      }
      nextProps.onSubmitUserForm.resolves()
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <DecoratedUserForm {...nextProps}/>
          </IntlProvider>
        </Provider>
      )

      // When
      const fieldFirstName = component.find('input[name="firstName"]')
      fieldFirstName.simulate('change', { target: { value: firstName } })
      const fieldLastName = component.find('input[name="lastName"]')
      fieldLastName.simulate('change', { target: { value: lastName } })
      const fieldEmail = component.find('input[name="email"]')
      fieldEmail.simulate('change', { target: { value: email } })
      const fieldSshKeyPublic = component.find('textarea[name="sshKeyPublic"]')
      fieldSshKeyPublic.simulate('change', { target: { value: sshKey } })
      const fieldPassword = component.find('input[name="password"]')
      fieldPassword.simulate('change', { target: { value: password } })
      const fieldPasswordConfirm = component.find('input[name="passwordConfirm"]')
      fieldPasswordConfirm.simulate('change', { target: { value: password } })
      component.find('form[name="userForm"]').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(fieldEmail).to.have.value(email)
      expect(fieldFirstName).to.have.value(firstName)
      expect(fieldLastName).to.have.value(lastName)
      expect(fieldSshKeyPublic).to.have.value(sshKey)
      expect(fieldPassword).to.have.value(password)
      expect(nextProps.onSubmitUserForm).to.have.callCount(1)
      expect(nextProps.onSubmitUserForm).to.have.been.calledWith({
        id: '1',
        email: email,
        firstName: firstName,
        lastName: lastName,
        sshKeyPublic: sshKey,
        password: password
      })
    })

    it('should handle edition submit', () => {
      // Given
      const email = 'email@user.com'
      const sshKey = 'sshKeyPublic'
      const nextProps = {
        ...props,
        ...{
          creation: false,
          edition: true,
          submitting: false,
          disabled: false,
          onSubmitUserForm: sinon.stub(),
          user: {
            id: '1'
          }
        }
      }
      nextProps.onSubmitUserForm.resolves()
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <DecoratedUserForm {...nextProps}/>
          </IntlProvider>
        </Provider>
      )

      // When
      const fieldEmail = component.find('input[name="email"]')
      fieldEmail.simulate('change', { target: { value: email } })
      const fieldSshKeyPublic = component.find('textarea[name="sshKeyPublic"]')
      fieldSshKeyPublic.simulate('change', { target: { value: sshKey } })
      component.find('form[name="userForm"]').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(fieldEmail).to.have.value(email)
      expect(fieldSshKeyPublic).to.have.value(sshKey)
      expect(nextProps.onSubmitUserForm).to.have.callCount(1)
      expect(nextProps.onSubmitUserForm).to.have.been.calledWith({
        id: '1',
        email: email,
        firstName: '',
        lastName: '',
        sshKeyPublic: sshKey,
        password: '',
      })
    })

    it('should handle cancel edit', () => {
      // Given
      const email = 'email@user.com'
      const nextProps = {
        ...props,
        ...{
          asyncValidate: () => Promise.resolve(),
          handleSubmit: fct => fct,
          creation: false,
          edition: true,
          onCancel: sinon.spy(),
          onUserEditCancel: sinon.spy(),
          onSubmitUserForm: sinon.spy(),
          userId: '1',
          reset: sinon.spy()
        }
      }
      const { context } = intlProvider.getChildContext()
      const component = shallow(
        <UserForm {...nextProps}/>,
        { context }
      )

      // When
      expect(component.find('IconButton').length).to.equal(1)
      component.find('IconButton').simulate('mouseUp', { preventDefault: () => {} })

      // Then
      expect(nextProps.onSubmitUserForm).to.have.callCount(0)
      expect(component).to.have.state('edited').to.be.false
      expect(nextProps.onUserEditCancel).to.have.callCount(1)
      expect(nextProps.onUserEditCancel).to.have.been.calledWith({
        1: {
          checked: false,
          edited: false
        }
      })
      expect(nextProps.onCancel).to.have.callCount(1)
      expect(nextProps.onCancel).to.have.been.calledWith('1')
      expect(nextProps.reset).to.have.callCount(1)
    })
  })
})
