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

import { browserHistory } from 'react-router'

import { setAuth, putAuth } from '../../services/auth.service'
import { requestWebsocket } from '../_utils/websocket/websocket.actions'
import { createUser } from '../user/user.actions'
import {
  ACCOUNT_NEW_REQUEST,
  ACCOUNT_NEW_SUCCESS,
  ACCOUNT_NEW_ACCEPTED,
  ACCOUNT_NEW_FAILURE
} from '../../commons/constants'

export function requestAccountRequest() {
  return {
    type: ACCOUNT_NEW_REQUEST
  }
}

export function requestAccountSuccess(data) {
  return {
    type: ACCOUNT_NEW_SUCCESS,
    payload: data
  }
}

export function requestAccountAccepted(data) {
  return {
    type: ACCOUNT_NEW_ACCEPTED,
    payload: data
  }
}

export function requestAccountFailure(data) {
  return {
    type: ACCOUNT_NEW_FAILURE,
    payload: data
  }
}

export function createAccount(email, captcha) {
  return dispatch => dispatch(requestAccountRequest())
    .then(data => dispatch(createUser(email, captcha)))
    .then(data => {
      if (!data.error && data.payload && data.payload.status === 202) {
        return dispatch(requestAccountAccepted(data.payload))
      }
      if (!data.error && data.payload && data.payload.status === 201) {
        return dispatch(requestAccountSuccess(data.payload))
      }
      dispatch(requestAccountFailure(data.payload))
      throw new Error(data.payload.status)
    })
    .then(data => {
      if (!data.error && data.payload.status === 202) {
        return Promise.resolve(data.payload)
      }
      if (!data.error && data.payload.status === 201) {
        // we set auth
        setAuth(data.payload.account.userName, data.payload.account.password)
        putAuth(data.payload.account.id, data.payload.account.userName)
        // init websocket and go to first project
        return dispatch(requestWebsocket())
          .then(() => Promise.resolve(browserHistory.push('/firstProject')))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}
