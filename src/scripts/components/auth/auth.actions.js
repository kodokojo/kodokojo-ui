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

import { CALL_API } from 'redux-api-middleware'
import Promise from 'bluebird'
import { change, stopSubmit } from 'redux-form'

import api from '../../commons/config'
import ioService from '../../services/io.service'
import { mapAccount } from '../../services/mapping.service'
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_RESET,
  CAPTCHA_INIT,
  CAPTCHA_UPDATE,
  CAPTCHA_RESET
} from '../../commons/constants'
import { logout } from '../login/login.actions'

export function requestAuthentication() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.user}`,
      headers: ioService.getHeaders(),
      types: [
        AUTH_REQUEST,
        {
          type: AUTH_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(account => (
              {
                account: mapAccount(account)
              }
            ))
        },
        AUTH_FAILURE
      ]
      // schema: user
    }
  }
}

// TODO UT
export function fetchAuthentication() {
  return (dispatch, getState) => {
    const { auth } = getState()
    if (
      auth && auth.account &&
      ( !auth.account.organisations || auth.account.organisations.length <= 0 )
    ) {
      return dispatch(requestAuthentication())
        .then(data => {
          if (!data.error) {
            return Promise.resolve(data)
          }
          if (data.error && data.payload.status && data.payload.status === 401) {
            dispatch(logout())
          }
          throw new Error(data.payload.status)
        })
        .catch(error => {
          throw new Error(error.message || error)
        })
    }
    return Promise.resolve()
  }
}

export function resetAuthentication() {
  return {
    type: AUTH_RESET
  }
}

// TODO UT
export function initCaptchaComponent() {
  return {
    type: CAPTCHA_INIT
  }
}

export function initCaptcha() {
  return dispatch => dispatch(change('signupForm', 'captcha', ''))
    .then(() => dispatch(initCaptchaComponent()))
}

export function updateCaptchaComponent(captcha) {
  return {
    type: CAPTCHA_UPDATE,
    payload: {
      captcha
    }
  }
}

export function updateCaptcha(captcha) {
  return dispatch => dispatch(change('signupForm', 'captcha', captcha))
    .then(() => dispatch(updateCaptchaComponent(captcha)))
}

export function resetCaptchaComponent() {
  return {
    type: CAPTCHA_RESET
  }
}

export function resetCaptcha() {
  return dispatch => dispatch(resetCaptchaComponent())
    // .then(() => dispatch(change('signupForm', 'captcha', '')))
}
