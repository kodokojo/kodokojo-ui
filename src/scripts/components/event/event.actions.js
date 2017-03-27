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

import {
  EVENT_REQUEST,
  EVENT_SUCCESS,
  EVENT_FAILURE,
  EVENT_STOP
} from '../../commons/constants'

export function eventRequest() {
  return {
    type: EVENT_REQUEST
  }
}

export function eventInit() {
  return dispatch => dispatch(eventRequest())
    .then(data => {
      if (!data.error) {
        // ok
      } else {
        // if 401, stop event
      }
    })
}

export function eventSuccess() {
  return {
    type: EVENT_SUCCESS
  }
}

export function eventFailure(event) {
  return {
    type: EVENT_FAILURE,
    payload: event
  }
}

export function eventStop() {
  return {
    type: EVENT_STOP
  }
}
