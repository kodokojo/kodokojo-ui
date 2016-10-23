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
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { mount, render, shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(chaiEnzyme())
chai.use(sinonChai)
import merge from '../../../../node_modules/lodash/merge'

// contexte
import { IntlProvider } from 'react-intl'

// component
import { Login } from './Login.component'

// TODO test error message when login
describe('<Login> component', () => {
  let props
  let messages
  let intlProvider

  beforeEach(() => {
    // TODO find another way to mock IntlProvider
    const mockFormatFct = options => options.id
    props = {
      fields: {
        username: '',
        psw: ''
      },
      handleSubmit: fct => fct,
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
      login: () => {},
      logout: () => {}
    }
    messages = {
      'username-hint-label': 'username-hint-label',
      'username-label': 'username-label',
      'password-label': 'password-label',
      'login-label': 'login-label'
    }
    intlProvider = new IntlProvider({ locale: 'en' }, {})
  })

  it('should render a form if not authenticated', () => {
    // Given
    const nextProps = merge(
      props,
      { isAuthenticated: false }
    )
    const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <Login {...nextProps}/>,
      context
    )

    // Then
    expect(component).to.have.descendants('form')
  })

  it('should render a div if authenticated', () => {
    // Given
    const nextProps = merge(
      props,
      { isAuthenticated: true }
    )
    // const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <Login {...nextProps}/>
    )

    // Then
    expect(component).to.have.descendants('div')
    expect(component.text()).to.contains('You are authenticated')
  })

  it('should set props properly', () => {
    // Given
    const nextProps = merge(
      props,
      {
        username: 'username',
        psw: 'password'
      }
    )

    // When
    const component = shallow(
      <IntlProvider locale="en" messages={messages}>
        <Login {...nextProps}/>
      </IntlProvider>
    )

    // Then
    expect(component.find(Login).props().username).to.equal('username')
    expect(component.find(Login).props().psw).to.equal('password')
    expect(component.find(Login).props().login).to.be.instanceof(Function)
    expect(component.find(Login).props().logout).to.be.instanceof(Function)
  })

  // TODO fix tests with mounted component and redux-form
  describe.skip('handle submit', () => {
    it('should trigger login if username & password inputs are not empty', () => {
      // Given
      const nextProps = merge(
        props,
        {
          fields: {
            username: {
              value: 'username'
            },
            psw: {
              value: 'password'
            }
          },
          login: sinon.stub()
        }
      )
      nextProps.login.resolves()
      const component = mount(
        <IntlProvider locale="en">
          <Login {...nextProps}/>
        </IntlProvider>
      )

      // When
      component.find('form').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(nextProps.login).to.have.callCount(1)
      expect(nextProps.login).to.have.been.calledWith('username', 'password')
    })

    it('should not login if username input is empty', () => {
      // Given
      const nextProps = merge(
        props,
        {
          fields: {
            username: {},
            psw: {
              value: 'password'
            }
          },
          login: sinon.spy()
        }
      )
      const component = mount(
        <IntlProvider locale="en">
          <Login {...nextProps}/>
        </IntlProvider>
      )

      // When
      component.find('form').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(nextProps.login).to.not.have.been.called
    })

    it('should not login if password input is empty', () => {
      // Given
      const nextProps = merge(
        props,
        {
          fields: {
            username: {
              value: 'username'
            },
            psw: {}
          },
          login: sinon.spy()
        }
      )
      const component = mount(
        <IntlProvider locale="en">
          <Login {...nextProps}/>
        </IntlProvider>
      )

      // When
      component.find('form').simulate('submit', { preventDefault: () => {} })

      // Then
      expect(nextProps.login).to.not.have.been.called
    })
  })

  describe('handle logout', () => {
    it('should logout', () => {
      // Given
      const nextProps = merge(
        props,
        {
          isAuthenticated: true,
          logout: sinon.spy()
        }
      )
      const component = mount(
        <Login {...nextProps}/>
      )

      // When
      component.find('button').simulate('click', { preventDefault: () => {} })

      // Then
      expect(nextProps.logout).to.not.have.callCount(1)
    })
  })
})
