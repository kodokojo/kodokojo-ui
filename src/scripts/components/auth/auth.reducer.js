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

import authService from '../../services/auth.service'
import {
  ACCOUNT_NEW_REQUEST,
  ACCOUNT_NEW_SUCCESS,
  ACCOUNT_NEW_ACCEPTED,
  ACCOUNT_NEW_FAILURE,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_RESET,
  CAPTCHA_INIT,
  CAPTCHA_UPDATE,
  CAPTCHA_RESET
} from '../../commons/constants'

export function authReducerInit() {
  return {
    account: authService.isAuth() ? authService.getAccount() : {},
    captcha: {
      value: '',
      reset: false
    },
    isAuthenticated: authService.isAuth() || false,
    isFetching: false
  }
}

const initialState = {
  account: {},
  captcha: {
    value: '',
    reset: false
  },
  isAuthenticated: false,
  isFetching: false
}

export default function auth(state = authReducerInit(), action) {
  if (action.type === ACCOUNT_NEW_REQUEST) {
    return {
      ...state,
      isAuthenticated: false,
      isFetching: true
    }
  }

  // TODO delete password / sshKeys from state after rendering
  if (action.type === ACCOUNT_NEW_SUCCESS || action.type === AUTH_SUCCESS) {
    return {
      ...state,
      account: action.payload.account,
      isAuthenticated: true,
      isFetching: false
    }
  }

  if (action.type === ACCOUNT_NEW_ACCEPTED) {
    return {
      ...state,
      isFetching: false
    }
  }

  if (action.type === ACCOUNT_NEW_FAILURE) {
    // TODO
    return {
      ...state,
      isAuthenticated: false,
      isFetching: false
    }
  }

  if (action.type === AUTH_REQUEST) {
    return {
      ...state,
      isAuthenticated: false,
      isFetching: true
    }
  }

  if (action.type === AUTH_FAILURE) {
    // TODO
    return {
      ...state,
      isAuthenticated: false,
      isFetching: false
    }
  }

  if (action.type === AUTH_RESET) {
    return initialState
  }

  // TODO UT
  if (action.type === CAPTCHA_INIT) {
    return {
      ...state,
      captcha: {
        value: '',
        reset: false
      }
    }
  }

  if (action.type === CAPTCHA_UPDATE) {
    return {
      ...state,
      captcha: {
        value: action.payload.captcha,
        reset: false
      }
    }
  }

  if (action.type === CAPTCHA_RESET) {
    return {
      ...state,
      captcha: {
        value: '',
        reset: true
      }
    }
  }

  return state
}
