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

import has from 'lodash/has'

import { prefs as prefsDefault } from './prefs'
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

export default function prefs(state = prefsDefault, action) {
  if (action.type === PREF_THEME_SET && has(action, 'theme')) {
    return {
      ...state,
      theme: action.theme
    }
  }

  if (action.type === PREF_LOCALE_SET && has(action, 'locale')) {
    return {
      ...state,
      locale: action.locale
    }
  }

  if (action.type === PREF_NAV_VISIBILITY_SET && has(action, 'navigation')) {
    return {
      ...state,
      navigation: action.navigation
    }
  }

  if (action.type === API_VERSION_REQUEST) {
    return {
      ...state,
      iSFetching: true
    }
  }

  if (action.type === API_VERSION_SUCCESS) {
    return {
      ...state,
      version: action.payload.version,
      iSFetching: false
    }
  }

  if (action.type === API_VERSION_FAILURE) {
    return {
      ...state,
      iSFetching: false
    }
  }

  if (action.type === UI_CONFIGURATION_REQUEST) {
    return {
      ...state,
      iSFetching: true
    }
  }

  if (action.type === UI_CONFIGURATION_SUCCESS) {
    return {
      ...state,
      configuration: action.payload.configuration,
      iSFetching: false
    }
  }

  if (action.type === UI_CONFIGURATION_FAILURE) {
    return {
      ...state,
      iSFetching: false
    }
  }

  return state
}

export const getReCaptchaKey = (state) => {
  if (
    state.configuration &&
    state.configuration.ui &&
    state.configuration.ui.RECAPTCHA &&
    state.configuration.ui.RECAPTCHA !== ''
  ) {
    return state.configuration.ui.RECAPTCHA
  }
  return null
}

export const getTosUri = (state) => {
  if (
    state.configuration &&
    state.configuration.ui &&
    state.configuration.ui.TOS &&
    state.configuration.ui.TOS !== ''
  ) {
    return state.configuration.ui.TOS
  }
  return null
}

export const getWaitingList = (state) => {
  if (
    state.configuration &&
    state.configuration.ui &&
    state.configuration.ui.WAITING_LIST &&
    state.configuration.ui.WAITING_LIST !== ''
  ) {
    return !!state.configuration.ui.WAITING_LIST
  }
  return false
}
