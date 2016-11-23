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

import { CALL_API } from 'redux-api-middleware'

import api from '../../commons/config'
import { getHeaders } from '../../services/io.service'
import { mapAccount, mapUser, mapUserOutput } from '../../services/mapping.service'
import {
  USER_NEW_ID_REQUEST,
  USER_NEW_ID_SUCCESS,
  USER_NEW_ID_FAILURE,
  USER_NEW_REQUEST,
  USER_NEW_SUCCESS,
  USER_NEW_FAILURE,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILURE,
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE
} from '../../commons/constants'
import { logout } from '../login/login.actions'

// TODO remove this when API change for one unique POST with user infos
export function requestNewUserId(email) {
  return {
    [CALL_API]: {
      method: 'POST',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.user}`,
      headers: getHeaders(),
      types: [
        {
          type: USER_NEW_ID_REQUEST,
          payload: (action, data) => ({
            email
          })
        },
        {
          type: USER_NEW_ID_SUCCESS,
          payload: (action, state, res) => res.text()
            .then(id => (
              {
                account: {
                  id
                }
              }
            ))
        },
        USER_NEW_ID_FAILURE
      ]

      // schema: user
    }
  }
}

// TODO update UT
export function requestNewUser(email, userId, captcha) {
  return {
    [CALL_API]: {
      method: 'POST',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.user}/${userId}`,
      headers: getHeaders({
        'g-recaptcha-response': captcha
      }),
      body: JSON.stringify({
        email
      }),
      types: [
        USER_NEW_REQUEST,
        {
          type: USER_NEW_SUCCESS,
          payload: (action, state, res) => {
            // if status is 201, user is created
            if (res.status === 201) {
              return res.json()
                .then(data => {
                  return {
                    status: res.status,
                    account: mapAccount(data)
                  }
                })
            }
            // else status is 202, user is added to waiting list
            return {
              status: res.status
            }
          }
        },
        USER_NEW_FAILURE
      ]

      // schema: user
    }
  }
}

export function createUser(email, captcha) {
  return dispatch => dispatch(requestNewUserId(email))
    .then(data => {
      if (!data.error && data.payload.account && data.payload.account.id) {
        const userId = data.payload.account.id
        return dispatch(requestNewUser(email, userId, captcha))
      }
      throw new Error(data.payload.status)
    })
    .then(data => {
      if (!data.error) {
        return Promise.resolve(data)
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function requestUser(userId) {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.user}/${userId}`,
      headers: getHeaders(),
      types: [
        USER_REQUEST,
        {
          type: USER_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(data => (
              {
                user: mapUser(data)
              }
            ))
        },
        USER_FAILURE
      ]

      // schema: user
    }
  }
}

export function getUser(userId) {
  return dispatch => dispatch(requestUser(userId))
    .then(data => {
      if (!data.error) {
        return Promise.resolve(data)
      }
      // TODO put this to error service?
      if (data.error && data.payload.status && data.payload.status === 401) {
        dispatch(logout())
      }
      throw new Error(data.payload.status)
    })
    .catch(error => Promise.reject(error.message || error))
}

export function requestUpdateUser(user) {
  return {
    [CALL_API]: {
      method: 'PATCH',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.user}/${user.id}`,
      headers: getHeaders(),
      body: JSON.stringify(mapUserOutput(user)),
      types: [
        USER_UPDATE_REQUEST,
        {
          type: USER_UPDATE_SUCCESS,
          payload: {
            user
          }
        },
        USER_UPDATE_FAILURE
      ]

      // schema: user
    }
  }
}

// TODO UT
export function updateUser(user) {
  return dispatch => dispatch(requestUpdateUser(user))
    .then(data => {
      if (!data.error) {
        if (data.payload && data.payload.user && data.payload.user.password) {
          dispatch(logout('alert-logout-password-text'))
        }
        return Promise.resolve(data)
      }
      throw new Error(data.payload.status)
    })
    .catch(error => Promise.reject(error.message || error))
}