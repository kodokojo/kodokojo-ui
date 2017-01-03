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
  WEBSOCKET_REQUEST,
  WEBSOCKET_SUCCESS,
  WEBSOCKET_FAILURE,
  WEBSOCKET_STOP
} from '../../../commons/constants'

const initialState = {
  connected: false,
  isFetching: false
}

export default function socket(state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case WEBSOCKET_SUCCESS:
      return {
        ...state,
        connected: true,
        isFetching: false
      }
    case WEBSOCKET_FAILURE:
    case WEBSOCKET_STOP:
      return {
        ...state,
        connected: false,
        isFetching: false
      }
    default:
      return state
  }
}
