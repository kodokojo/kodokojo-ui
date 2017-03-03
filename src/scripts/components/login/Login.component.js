/**
 * Kodo Kojo - Software factory done right
 * Copyright © 2017 Kodo Kojo (infos@kodokojo.io)
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

import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, SubmissionError, propTypes, reset } from 'redux-form'
import { intlShape, injectIntl } from 'react-intl'
import Promise from 'bluebird'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import Input from 'kodokojo-ui-commons/src/scripts/components/input/Input.component'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'

// Component
import loginValidator from './login.validator'
import { login, logout } from './login.actions'
import { returnErrorKeyOrMessage } from '../../services/error.service'

// validate function
const validate = loginValidator

// TODO if user already logged in, fetch user id from storage and fetch user from api to store
// Login component
export class Login extends React.Component {

  static propTypes = {
    intl: intlShape.isRequired,
    isAuthenticated: React.PropTypes.bool,
    login: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    values: React.PropTypes.object,
    ...propTypes
  }

  handleSubmitLogin = (values) => {
    const { login } = this.props // eslint-disable-line no-shadow

    const nexUserName = values.username ? values.username.trim() : ''
    const nexPassword = values.password ? values.password.trim() : ''

    return login(nexUserName, nexPassword)
      .then(Promise.resolve())
      .catch(err => Promise.reject(
        new SubmissionError(
          { password: returnErrorKeyOrMessage(
            {
              component: 'login',
              message: err.message
            })
          }
        )
      ))
  }

  handleLogout = (event) => {
    const { logout, reset } = this.props // eslint-disable-line no-shadow
    if (event) {
      event.preventDefault()
    }
    reset()
    logout()
  }

  render() {
    const { handleSubmit, submitting, isAuthenticated } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    return (
      <div>
        { !isAuthenticated &&
          <form id="loginForm"
                name="loginForm"
                noValidate
                onSubmit={ handleSubmit(this.handleSubmitLogin) }
          >
            <Field
                component={ Input }
                errorKey="username-label"
                hint={ formatMessage({ id: 'username-hint-label' }) }
                icon="account_box"
                id="username"
                label={ formatMessage({ id: 'username-label' }) }
                name="username"
                required
                type="text"
            />
            <Field
              component={ Input }
              errorKey="password-label"
              icon="lock_open"
              id="password"
              label={ formatMessage({ id: 'password-label' }) }
              name="password"
              required
              type="password"
            />
            <Button
                disabled={ submitting }
                label={ formatMessage({ id: 'login-label' }) }
                primary
                title={ formatMessage({ id: 'login-label' }) }
                type="submit"
            />
          </form>
        }
        { isAuthenticated &&
          <div>
            <p>You are authenticated.</p>
            <Button
              label="Log out"
              onMouseUp={ this.handleLogout }
              primary
            />
          </div>
        }
      </div>
    )
  }

}

// Login container
const mapStateProps = (state) => (
  {
    isAuthenticated: state.auth.isAuthenticated
  }
)

const LoginContainer = compose(
  connect(
    mapStateProps,
    {
      login,
      logout
    }
  ),
  injectIntl
)(reduxForm(
  {
    form: 'loginForm',
    touchOnChange: true,
    validate
  }
)(Login))

export default LoginContainer
