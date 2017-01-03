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
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'
import Promise from 'bluebird'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import Input from 'kodokojo-ui-commons/src/scripts/components/input/Input.component'
import Checkbox from 'kodokojo-ui-commons/src/scripts/components/checkbox/Checkbox.component'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'
import Dialog from 'kodokojo-ui-commons/src/scripts/components/dialog/Dialog.component'

// Component
import signupTheme from './signup.scss'
import Captcha from '../../components/captcha/Captcha.component'
import ErrorMessage from '../../components/message/ErrorMessage.component'
import signupValidator from './signup.validator'
import { createAccount } from './signup.actions'
import { initCaptcha, resetCaptcha, updateCaptcha } from '../auth/auth.actions'
import { getReCaptchaKey, getTosUri, getWaitingList } from '../../commons/reducers'
import { returnErrorKeyOrMessage } from '../../services/error.service'

// validate function
const validate = signupValidator

// Signup component
export class Signup extends React.Component {

  static propTypes = {
    account: React.PropTypes.object,
    captcha: React.PropTypes.string,
    captchaReset: React.PropTypes.bool,
    createAccount: React.PropTypes.func.isRequired,
    initCaptcha: React.PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    locale: React.PropTypes.string,
    resetCaptcha: React.PropTypes.func.isRequired,
    updateCaptcha: React.PropTypes.func.isRequired,
    ...propTypes
  }

  constructor(props) {
    super(props)
    this.state = {
      isDialogActive: false,
      TOSAgreement: false
    }
  }

  handleSubmitSignup = (values) => {
    const { createAccount, resetCaptcha, reCaptchaKey } = this.props // eslint-disable-line no-shadow
    
    const nextEmail = values.email ? values.email.trim() : '' 

    // optional feature
    const nexCaptcha = reCaptchaKey ? values.captcha : undefined

    return createAccount(nextEmail, nexCaptcha)
      .then(data => {
        if (data && data.status) {
          this.handleAccountAccepted()
        }
        return Promise.resolve()
      })
      .catch(err => {
        const error = new SubmissionError(
          { email: returnErrorKeyOrMessage(
            {
              component: 'account',
              message: err.message
            })
          }
        )

        // if error code is any 400 or 500, recaptcha must be reset
        if (err.message && err.message.match(/^(4|5)\d{2}$/)) {
          // optional feature
          if (reCaptchaKey) {
            return resetCaptcha()
              .then(() => Promise.reject(error))
          } else {
            return Promise.reject(error)
          }
        }
        return Promise.reject(error)
      })
  }

  handleAccountAccepted = () => {
    const { resetCaptcha, reset, reCaptchaKey, tosUri, waitingList } = this.props

    // optional feature
    if (reCaptchaKey) {
      resetCaptcha()
    }
    reset('signupForm')

    const nextState = {}

    // optional feature
    if (waitingList) {
      nextState['isDialogActive'] = true
    }

    // optional feature
    if (tosUri) {
      nextState['TOSAgreement'] = false
    }

    this.setState(nextState)
  }

  handleCaptchaInit = () => {
    const { initCaptcha } = this.props // eslint-disable-line no-shadow
    
    initCaptcha()
  }

  handleCaptchaUpdate = (nextCaptcha) => {
    const { updateCaptcha } = this.props // eslint-disable-line no-shadow

    updateCaptcha(nextCaptcha)
  }

  handleTOSAgreementChange = () => {
    this.setState({
      TOSAgreement: !this.state.TOSAgreement
    })
  }

  handleDialogClose = () => {
    this.setState({
      isDialogActive: false
    })
  }

  render() {
    const { captchaReset, handleSubmit, submitting, locale, reCaptchaKey, tosUri, waitingList } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    return (
      <form id="signupForm"
            name="signupForm"
            noValidate
            onSubmit={ handleSubmit(this.handleSubmitSignup) }
      >
        <Field
            component={ Input }
            errorKey="email-input-label"
            hint={ formatMessage({ id: 'email-hint-label' }) }
            icon="email"
            label={ formatMessage({ id: 'email-label' }) }
            name="email"
            required
            type="email"
        />
        { /* <Field
          component={ Input }
          hint={ formatMessage({ id: 'company-hint-label' }) }
          icon="domain"
          label={ formatMessage({ id: 'company-label' }) }
          name="entity"
          type="text"
        /> */}
        { reCaptchaKey &&
          // optional feature
          // TODO add a loader when recaptcha is not loaded, disable it on load callback
          <div style={{ height: '112px' }}>
            <Captcha
              locale={ locale }
              onExpiredCallback={ () => { console.log('captcha has expired') } }
              onLoadCallback={ () => console.log('captcha has loaded') }
              onResetCallback={ this.handleCaptchaInit }
              onVerifyCallback={ this.handleCaptchaUpdate }
              reset={ captchaReset }
              sitekey={ reCaptchaKey }
              theme="light"
            />
            <Field
              component={ ErrorMessage }
              name="captcha"
            />
          </div>
        }
        { tosUri &&
          // optional feature
          <div className={ signupTheme['terms-container'] }>
            <Checkbox
              checked={ !!this.state.TOSAgreement }
              label={
                <FormattedMessage
                  id="terms-of-service-text"
                  style={{ color: '#FFF' }}
                  values={{
                    termsLinkComponent: (
                      <a className={ signupTheme['terms-link'] } href={ tosUri } target="_blank" ><FormattedMessage id="terms-of-service-label"/></a>
                    )
                  }}
                />
              }
              onChange={ () => this.handleTOSAgreementChange() }
            />
          </div>
        }
        <Button
            disabled={
              submitting || (tosUri && !this.state.TOSAgreement)
            }
            label={ waitingList ? formatMessage({ id: 'register-label' }) : formatMessage({ id: 'signup-label' }) }
            primary
            title={ waitingList ? formatMessage({ id: 'register-label' }) : formatMessage({ id: 'signup-label' }) }
            type="submit"
        />
        { waitingList &&
          <Dialog
            actions={[
              { label: formatMessage({ id: 'close-label' }), onClick: this.handleDialogClose }
            ]}
            active={ this.state.isDialogActive }
            onEscKeyDown={ this.handleDialogClose }
            onOverlayClick={ this.handleDialogClose }
            // title={ formatMessage({ id: 'account-label' }) }
          >
            <FormattedMessage id="account-accepted-text"/>
          </Dialog>
        }
      </form>
    )
  }
}

// Signup container
const mapStateProps = (state) => (
  {
    account: state.auth.account,
    captcha: state.auth.captcha.value,
    captchaReset: state.auth.captcha.reset,
    locale: state.prefs.locale,
    reCaptchaKey: getReCaptchaKey(state),
    tosUri: getTosUri(state),
    waitingList: getWaitingList(state)
  }
)

const SignupContainer = compose(
  connect(
    mapStateProps,
    {
      createAccount,
      initCaptcha,
      updateCaptcha,
      resetCaptcha,
      reset
    }
  ),
  injectIntl
)(reduxForm(
  {
    form: 'signupForm',
    touchOnChange: true,
    validate
  }
)(Signup))

export default SignupContainer
