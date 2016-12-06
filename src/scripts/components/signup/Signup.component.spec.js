/**
 * Kodo Kojo - Software factory done right
 * Copyright © 2016 Kodo Kojo (infos@kodokojo.io)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable no-unused-expressions */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-duplicates */

import React from 'react'
import Promise from 'bluebird'
import { reduxForm, reducer as formReducer, getFormValues } from 'redux-form'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { mount, render, shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import 'sinon-as-promised'
chai.use(chaiEnzyme())
chai.use(sinonChai)
import merge from '../../../../node_modules/lodash/merge'

// contexte
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { IntlProvider } from 'react-intl'

// component
import { Signup, __RewireAPI__ as SignupRewire } from './Signup.component'
import signupValidator from './signup.validator'

// TODO add test for recaptcha, tos and waiting list
describe('<Signup> component', () => {
  let props
  let messages
  let intlProvider
  let captchaMock

  beforeEach(() => {
    // TODO find another way to mock IntlProvider and redux-form
    const mockFormatFct = options => options.id
    props = {
      // redux-form
      asyncValidating: false,
      dirty: false,
      invalid: false,
      initialized: false,
      pristine: true,
      submitFailed: false,
      submitSucceeded: false,
      valid: false,
      // asyncValidate: () => Promise.resolve(),
      blur: () => {},
      change: () => {},
      destroy: () => {},
      dispatch: () => {},
      initialize: () => {},
      reset: () => {},
      touch: () => {},
      untouch: () => {},
      // handleSubmit: fct => fct,
      // intl
      intl: {
        formatMessage: mockFormatFct,
        formatDate: mockFormatFct,
        formatPlural: mockFormatFct,
        formatTime: mockFormatFct,
        formatRelative: mockFormatFct,
        formatNumber: mockFormatFct,
        formatHTMLMessage: mockFormatFct,
        now: mockFormatFct
      },
      submitting: false,
      createAccount: () => {},
      initCaptcha: () => {},
      updateCaptcha: () => {},
      resetCaptcha: () => {},
      locale: 'fr',
      captcha: '',
      captchaReset: false
    }
    messages = {
      'email-label': 'email-label',
      'email-hint-label': 'email-hint-label',
      'company-label': 'company-label',
      'company-hint-label': 'company-hint-label',
      'signup-label': 'signup-button-label'
    }
    intlProvider = new IntlProvider({ locale: 'en' }, {})
    class captchaMock extends React.Component {
      render() {
        return <div id="captcha"/>
      }
    }
    SignupRewire.__Rewire__('Captcha', captchaMock)
  })

  afterEach(() => {
    SignupRewire.__ResetDependency__('Captcha')
  })

  it('should render a form', () => {
    // Given
    const nextProps = merge(
      props,
      {
        asyncValidate: () => Promise.resolve(),
        handleSubmit: fct => fct
      }
    )
    const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <Signup {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.descendants('form')
  })

  it('should render i18n ids', () => {
    // Given
    const nextProps = merge(
      props,
      {
        asyncValidate: () => Promise.resolve(),
        handleSubmit: fct => fct,
        intl: {
          formatMessage: sinon.stub(props.intl, 'formatMessage', (options) => options.id)
        }
      }
    )
    const { context } = intlProvider.getChildContext()

    // When
    shallow(
      <Signup {...nextProps}/>,
        { context }
    )

    // Then
    expect(nextProps.intl.formatMessage).to.have.callCount(4)
    expect(nextProps.intl.formatMessage).to.have.been.calledWith({ id: 'email-label' })
    expect(nextProps.intl.formatMessage).to.have.been.calledWith({ id: 'email-hint-label' })
    expect(nextProps.intl.formatMessage).to.have.been.calledWith({ id: 'signup-label' })
    // expect(nextProps.intl.formatMessage).to.have.been.calledWith({ id: 'company-label' })
    // expect(nextProps.intl.formatMessage).to.have.been.calledWith({ id: 'company-hint-label' })
  })

  describe('handle submit', () => {
    let store
    let DecoratedSignup

    beforeEach(() => {
      store = createStore(combineReducers({
        form: formReducer
      }))
      DecoratedSignup = reduxForm({ form: 'signupForm', signupValidator })(Signup)
    })

    it('should trigger creatAccount if email input and captcha are not empty', () => {
      // Given
      const nextProps = merge(
        props,
        {
          reCaptchaKey: null,
          tosUri: null,
          waitingList: null,
          createAccount: sinon.stub()
        }
      )
      nextProps.createAccount.resolves()
      const component = mount(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <DecoratedSignup {...nextProps}/>
          </IntlProvider>
        </Provider>
      )

      // When
      const fieldEmail = component.find('input[type="email"]')
      fieldEmail.simulate('change', { target: { value: 'email@test.com' } })
      component.find('form').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(nextProps.createAccount).to.have.callCount(1)
      expect(nextProps.createAccount).to.have.been.calledWith('email@test.com')
    })
  })
})
