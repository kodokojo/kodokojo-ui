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
  ORGANISATION_REQUEST,
  ORGANISATION_SUCCESS,
  ORGANISATION_FAILURE,
  ORGANISATION_NEW_REQUEST,
  ORGANISATION_NEW_SUCCESS,
  ORGANISATION_NEW_FAILURE,
  ORGANISATION_LIST_REQUEST,
  ORGANISATION_LIST_SUCCESS,
  ORGANISATION_LIST_FAILURE,
} from '../../commons/constants'

export function organisationReducerInit() {
  return {
    list: {},
    isFetching: false
  }
}

// TODO UT
export default function organisation(state = organisationReducerInit(), action) {
  if (
    action.type === ORGANISATION_LIST_REQUEST ||
    action.type === ORGANISATION_REQUEST ||
    action.type === ORGANISATION_NEW_REQUEST
  ) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (action.type === ORGANISATION_LIST_SUCCESS) {

    let organisations = {}
    action.payload.organisations.forEach(organisation =>
      organisations = {
        ...organisations,
        [organisation.id]: organisation
      }
    )

    return {
      list: {
        ...organisations,
        ...state.list
      }, 
      isFetching: false
    }
  }

  if (
    action.type === ORGANISATION_SUCCESS ||
    action.type === ORGANISATION_NEW_SUCCESS
  ) {

    const organisation = action.payload.organisation

    return {
      ...state,
      list: {
        ...state.list,
        [organisation.id]: organisation
      },
      isFetching: false
    }
  }

  if (
    action.type === ORGANISATION_LIST_FAILURE ||
    action.type === ORGANISATION_FAILURE ||
    action.type === ORGANISATION_NEW_FAILURE
  ) {
    // TODO
    return {
      ...state,
      isFetching: false
    }
  }

  return state
}
