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
import {
  API_VERSION_REQUEST,
  API_VERSION_SUCCESS,
  API_VERSION_FAILURE,
  UI_CONFIGURATION_REQUEST,
  UI_CONFIGURATION_SUCCESS,
  UI_CONFIGURATION_FAILURE,
  PREF_THEME_SET,
  PREF_LOCALE_SET,
  PREF_NAV_VISIBILITY_SET
} from '../../commons/constants'
import uiVersion from '../../../../config/shared/ui.version.json'

// TODO UT
export function fetchApiVersion() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.version}`,
      types: [
        API_VERSION_REQUEST,
        {
          type: API_VERSION_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(apiVersion => (
              {
                version: {
                  api: apiVersion,
                  ui: uiVersion
                }
              }
            ))
        },
        API_VERSION_FAILURE
      ]
    }
  }
}

export function getApiVersion() {
  return dispatch =>  dispatch(fetchApiVersion())
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

export function fetchUiConfiguration() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}/assets/json/ui.configuration.json`,
      types: [
        UI_CONFIGURATION_REQUEST,
        {
          type: UI_CONFIGURATION_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(uiConfiguration => (
              {
                configuration: {
                  ui: uiConfiguration
                }
              }
            ))
        },
        UI_CONFIGURATION_FAILURE
      ]
    }
  }
}

export function getUiConfiguration() {
  return dispatch =>  dispatch(fetchUiConfiguration())
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

export function setTheme(theme) {
  return {
    type: PREF_THEME_SET,
    theme
  }
}

export function setLocale(locale) {
  return {
    type: PREF_LOCALE_SET,
    locale
  }
}

export function setNavVisibility(navigation) {
  return {
    type: PREF_NAV_VISIBILITY_SET,
    navigation
  }
}
