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

import api from '../../commons/config'
import ioService from '../../services/io.service'
import {
  DB_REQUEST,
  DB_SUCCESS,
  DB_FAILURE,
  DB_ID_REQUEST,
  DB_ID_SUCCESS,
  DB_ID_FAILURE
} from '../../commons/constants'

export function requestDbEntries() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.db}`,
      headers: ioService.getHeaders(),
      types: [
        DB_REQUEST,
        {
          type: DB_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(entries => (
              {
                entries
              }
            ))
        },
        DB_FAILURE
      ]
    }
  }
}

export function getDbEntries() {
  return dispatch => dispatch(requestDbEntries())
    .then(data => {
      if (!data.error) {
        return Promise.resolve()
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function requestDbEntry(id) {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.db}/${btoa(id)}`,
      headers: ioService.getHeaders(),
      types: [
        DB_ID_REQUEST,
        {
          type: DB_ID_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(entry => (
              {
                entry
              }
            ))
        },
        DB_ID_FAILURE
      ]
    }
  }
}

export function getDbEntry(id) {
  return dispatch => dispatch(requestDbEntry(id))
    .then(data => {
      if (!data.error) {
        return Promise.resolve()
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}
