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
  DB_REQUEST,
  DB_SUCCESS,
  DB_FAILURE,
  DB_ID_REQUEST,
  DB_ID_SUCCESS,
  DB_ID_FAILURE
} from '../../commons/constants'

export function dbReducerInit() {
  return {
    entry: {},
    entries: [],
    isFetching: false
  }
}

// TODO UT
export default function db(state = dbReducerInit(), action) {
  if (action.type === DB_REQUEST) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (action.type === DB_SUCCESS) {
    return {
      ...state,
      entries: action.payload.entries,
      isFetching: false
    }
  }

  if (action.type === DB_FAILURE) {
    return {
      ...state,
      isFetching: false
    }
  }

  if (action.type === DB_ID_REQUEST) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (action.type === DB_ID_SUCCESS) {
    return {
      ...state,
      entry: action.payload.entry,
      isFetching: false
    }
  }

  if (action.type === DB_ID_FAILURE) {
    return {
      ...state,
      isFetching: false
    }
  }
  
  return state
}
