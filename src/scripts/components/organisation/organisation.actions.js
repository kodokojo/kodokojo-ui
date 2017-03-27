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
import { requestAuthentication, logout } from '../login/login.actions'
import { getHeaders } from '../../services/io.service'
import { mapOrganisation } from '../../services/mapping.service'
import {
  ORGANISATION_CHANGE,
  ORGANISATION_REQUEST,
  ORGANISATION_SUCCESS,
  ORGANISATION_FAILURE,
  ORGANISATION_NEW_REQUEST,
  ORGANISATION_NEW_SUCCESS,
  ORGANISATION_NEW_FAILURE,
  ORGANISATION_LIST_REQUEST,
  ORGANISATION_LIST_SUCCESS,
  ORGANISATION_LIST_FAILURE
} from '../../commons/constants'

export function fetchOrganisationList() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.organisation}`,
      headers: getHeaders(),
      types: [
        ORGANISATION_LIST_REQUEST,
        {
          type: ORGANISATION_LIST_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(organisations => (
              {
                organisations: organisations.map(organisation => mapOrganisation(organisation))
              }
            ))
        },
        ORGANISATION_LIST_FAILURE
      ]
    }
  }
}

export function getOrganisationList() {
  return (dispatch, getState) => dispatch(fetchOrganisationList())
    .then(data => {
      if (!data.error) {
        const state = getState()
        if (
          state.auth && state.auth.account && 
          ( !state.auth.organisations || state.auth.organisations.length <= 0 ) 
        ) {
          return dispatch(requestAuthentication())
        }
        return Promise.resolve(data)
      }
      throw new Error(data.payload.status)
    })
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
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function fetchOrganisation(organisationId) {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.organisation}/${organisationId}`,
      headers: getHeaders(),
      types: [
        ORGANISATION_REQUEST,
        {
          type: ORGANISATION_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(organisation => (
              {
                organisation: mapOrganisation(organisation)
              }
            ))
        },
        ORGANISATION_FAILURE
      ]
    }
  }
}

export function changeOrganisation(prevContext, nextContext) {
  return {
    type: ORGANISATION_CHANGE,
    prevContext,
    nextContext
  }
}

export function updateOrganisation(organisationId) {
  return (dispatch, getState) => dispatch(fetchOrganisation(organisationId))
    .then(data => {
      if (!data.error) {
        const state = getState()
        return dispatch(changeOrganisation(data.payload, state.auth.account))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function requestNewOrganisation(name) {
  return {
    [CALL_API]: {
      method: 'POST',
      endpoint: `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.organisation}`,
      headers: getHeaders(),
      body: JSON.stringify({
        name: name
      }),
      types: [
        ORGANISATION_NEW_REQUEST,
        {
          type: ORGANISATION_NEW_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(data => (
              {
                organisation: mapOrganisation(data)
              }
            ))
        },
        ORGANISATION_NEW_FAILURE
      ]
    }
  }
}

export function createOrganisation(name) {
  return dispatch => dispatch(requestNewOrganisation(name))
    .then(data => {
      if (!data.error) {
        return dispatch(requestAuthentication())
      }
      throw new Error(data.payload.status)
    })
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
