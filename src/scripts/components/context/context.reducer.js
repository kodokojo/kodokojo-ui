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

import authService from '../../services/auth.service'
import storageService from '../../services/storage.service'
import { getNextContext } from '../../services/stateUpdater.service'
import {
  ACCOUNT_NEW_SUCCESS,
  AUTH_SUCCESS,
  AUTH_RESET,
  ORGANISATION_CHANGE,
  PROJECT_CONFIG_SUCCESS,
  PROJECT_CONFIG_NEW_SUCCESS,
  PROJECT_SUCCESS,
} from '../../commons/constants'

export function contextReducerInit() {
  const account = authService.isAuth() ? authService.getAccount() : {}
  const organisationId = storageService.get('organisationId')
  const organisationName = storageService.get('organisationName')
  const projectConfigId = storageService.get('projectConfigId')
  const projectConfigName= storageService.get('projectConfigName')
  const projectId = storageService.get('projectId')
  const projectName = storageService.get('projectName')

  return {
    user: {
      id: account.id || undefined,
      name: account.name || undefined,
      group: account.group || 'USER'
    },
    organisation: {
      id: organisationId || undefined,
      name: organisationName || ''
    },
    projectConfig: {
      id: projectConfigId || undefined,
      name: projectConfigName || ''
    },
    project: {
      id: projectId || undefined
    }
  }
}

// TODO UT
export default function context(state = contextReducerInit(), action) {
  if (action.type === PROJECT_CONFIG_NEW_SUCCESS || action.type === PROJECT_CONFIG_SUCCESS) {
    return {
      ...state,
      projectConfig: {
        id: action.payload.projectConfig.id,
        name: action.payload.projectConfig.name
      }
    }
  }

  if (action.type === PROJECT_SUCCESS) {
    return {
      ...state,
      project: {
        id: action.payload.project.id
      }
    }
  }

  if (action.type === ACCOUNT_NEW_SUCCESS || action.type === AUTH_SUCCESS) {
    const nextContext = getNextContext(state, action.payload.account)

    return {
      ...state,
      ...nextContext
    }
  }

  if (action.type === ORGANISATION_CHANGE) {
    const nextContext = getNextContext(action.prevContext, action.nextContext)

    return {
      ...state,
      ...nextContext
    }
  }

  return state
}
