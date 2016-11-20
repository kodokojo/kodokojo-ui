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

import React from 'react'
import classNames from 'classnames'

// component
import captchaTheme from './captcha.scss'

// this component was inspired by
// https://github.com/evenchange4/react-grecaptcha
// https://github.com/twobucks/react-gcaptcha
// thanks!

class Captcha extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    elementID: React.PropTypes.string,
    locale: React.PropTypes.string,
    onExpiredCallback: React.PropTypes.func,
    onExpiredCallbackName: React.PropTypes.string,
    onLoadCallback: React.PropTypes.func,
    onLoadCallbackName: React.PropTypes.string,
    onResetCallback: React.PropTypes.func,
    onVerifyCallback: React.PropTypes.func,
    render: React.PropTypes.string,
    reset: React.PropTypes.bool,
    sitekey: React.PropTypes.string,
    size: React.PropTypes.string,
    theme: React.PropTypes.string,
    type: React.PropTypes.string
  }

  static defaultProps = {
    elementID: 'g-recaptcha',
    locale: 'en',
    onExpiredCallback: () => {},
    onExpiredCallbackName: 'recaptchaExpired',
    onLoadCallback: () => {},
    onLoadCallbackName: 'recaptchaLoaded',
    onResetCallback: () => {},
    onVerifyCallback: () => {},
    render: 'explicit',
    reset: undefined,
    size: 'normal',
    theme: 'light',
    type: 'image'
  }

  constructor(props) {
    super(props)
    this.state = {
      captcha: ''
    }
  }

  componentWillMount() {
    this.injectCaptcha()
  }

  componentDidMount() {
    const { grecaptcha } = window  // eslint-disable-line no-shadow

    if (typeof grecaptcha !== 'undefined') {
      this.loadCaptcha()
    } else {
      window[this.props.onLoadCallbackName] = () => {
        this.loadCaptcha()
        if (this.props.onLoadCallback) {
          this.props.onLoadCallback()
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      this.resetCaptcha()
    }
  }

  componentWillUpdate(nextProps) {
    const { locale } = this.props

    if (nextProps.locale !== locale) {
      this.injectCaptcha()
    }
    if (nextProps.reset) {
      this.resetCaptcha()
    }
  }

  componentWillUnmount() {
    this.resetCaptcha()
    this.removeCaptchaScript()
  }

  loadCaptcha = () => {
    const { elementID, onExpiredCallback, onVerifyCallback, render, sitekey, size, theme, type } = this.props
    const { grecaptcha } = window // eslint-disable-line no-shadow

    const captcha = grecaptcha.render(elementID, {
      sitekey,
      callback: onVerifyCallback,
      'expired-callback': onExpiredCallback,
      theme,
      render,
      type,
      size
    })
    this.setState({ captcha })
  }

  injectCaptcha() {
    const { elementID, locale, onExpiredCallback, onLoadCallbackName, onExpiredCallbackName } = this.props  // eslint-disable-line no-shadow

    // remove grecaptcha scripts
    this.removeCaptchaScript()

    // inject and lazy load grecaptcha
    const head = document.head || document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.id = `script-${elementID}`
    script.src = `https://www.google.com/recaptcha/api.js?onload=${onLoadCallbackName}&render=explicit&hl=${locale}`
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.onerror = (oError) => {
      throw new URIError(`The script ${oError.target.src} is not accessible.`)
    }
    head.appendChild(script)

    // expose callback function to window object
    window[onLoadCallbackName] = this.loadCaptcha
    window[onExpiredCallbackName] = () => onExpiredCallback
  }

  resetCaptcha() {
    const { onResetCallback } = this.props
    const { grecaptcha } = window // eslint-disable-line no-shadow

    if (typeof grecaptcha !== 'undefined') {
      onResetCallback()
      grecaptcha.reset(this.state.captcha)
    }
  }

  removeCaptchaScript() {
    const { elementID, onLoadCallbackName, onExpiredCallbackName } = this.props

    // remove grecaptcha script
    const scriptGrecaptcha = document.getElementById(`script-${elementID}`)
    if (scriptGrecaptcha) {
      scriptGrecaptcha.remove()
    }
    // remove grecaptcha element
    const elementGrecaptcha = document.getElementById(`${elementID}`)
    if (elementGrecaptcha) {
      elementGrecaptcha.remove()
    }
    // remove all global variables
    delete window.grecaptcha
    delete window[onLoadCallbackName]
    delete window[onExpiredCallbackName]
  }

  render() {
    const { className, elementID } = this.props

    return (
      <div
        className={
          classNames(className, captchaTheme['captcha-container'])
        }
        id={ elementID }
      />
    )
  }
}

export default Captcha
