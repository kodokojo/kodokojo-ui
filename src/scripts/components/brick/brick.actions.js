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
import { getHeaders } from '../../services/io.service'
import { mapBricksDetails } from '../../services/mapping.service'
import {
  BRICK_REQUEST,
  BRICK_SUCCESS,
  BRICK_FAILURE
} from '../../commons/constants'

export function fetchBricks() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.brick}`,
      headers: getHeaders(),
      types: [
        BRICK_REQUEST,
        {
          type: BRICK_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(bricks => mapBricksDetails(bricks))
        },
        BRICK_FAILURE
      ]
    }
  }
}

export function getBricks() {
  return dispatch => dispatch(fetchBricks())
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
