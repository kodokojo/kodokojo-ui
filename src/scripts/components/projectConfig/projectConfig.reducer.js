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

import storageService from '../../services/storage.service'
import { updateBricks, computeAggregatedStackStatus, removeUsers } from '../../services/stateUpdater.service'
import {
  AUTH_RESET,
  PROJECT_CONFIG_REQUEST,
  PROJECT_CONFIG_SUCCESS,
  PROJECT_CONFIG_FAILURE,
  PROJECT_CONFIG_NEW_REQUEST,
  PROJECT_CONFIG_NEW_SUCCESS,
  PROJECT_CONFIG_NEW_FAILURE,
  PROJECT_CONFIG_ADD_USER_REQUEST,
  PROJECT_CONFIG_ADD_USER_SUCCESS,
  PROJECT_CONFIG_ADD_USER_FAILURE,
  PROJECT_CONFIG_DELETE_USERS_REQUEST,
  PROJECT_CONFIG_DELETE_USERS_SUCCESS,
  PROJECT_CONFIG_DELETE_USERS_FAILURE,
  PROJECT_SUCCESS,
  PROJECT_UPDATE
} from '../../commons/constants'

export function projectConfigReducerInit() {
  const initialState = {
    id: storageService.get('projectConfigId'),
    isFetching: false
  }
  const project = {
    id: storageService.get('projectId')
  }
  if (project.id) {
    initialState.project = project
  }

  return initialState
}

export default function projectConfig(state = projectConfigReducerInit(), action) {
  if (action.type === PROJECT_CONFIG_NEW_REQUEST || action.type === PROJECT_CONFIG_REQUEST) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (action.type === PROJECT_CONFIG_NEW_SUCCESS || action.type === PROJECT_CONFIG_SUCCESS) {
    return {
      ...state,
      ...action.payload.projectConfig,
      isFetching: false
    }
  }

  if (action.type === PROJECT_CONFIG_NEW_FAILURE || action.type === PROJECT_CONFIG_FAILURE) {
    // TODO
    return {
      ...state,
      isFetching: false
    }
  }

  if (action.type === PROJECT_CONFIG_ADD_USER_REQUEST) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (action.type === PROJECT_CONFIG_ADD_USER_SUCCESS) {
    return {
      ...state,
      isFetching: false
    }
  }

  if (action.type === PROJECT_CONFIG_ADD_USER_FAILURE) {
    // TODO
    return {
      ...state,
      isFetching: false
    }
  }

  if (action.type === PROJECT_CONFIG_DELETE_USERS_REQUEST) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (action.type === PROJECT_CONFIG_DELETE_USERS_SUCCESS) {
    let users
    if (state && state.users) {
      users = removeUsers(state.users, action.payload.usersToDelete)
    }
    return {
      ...state,
      users,
      isFetching: false
    }
  }

  if (action.type === PROJECT_CONFIG_DELETE_USERS_FAILURE) {
    // TODO
    return {
      ...state,
      isFetching: false
    }
  }

  if (action.type === PROJECT_SUCCESS) {
    let bricks
    if (action.payload.project && action.payload.project.stacks && action.payload.project.stacks[0] && action.payload.project.stacks[0].bricks) {
      bricks = updateBricks(state.stacks[0].bricks, action.payload.project.stacks[0].bricks)
    }
    return {
      ...state,
      project: {
        id: action.payload.project.id,
        updateDate: action.payload.project.updateDate
      },
      stacks: [
        {
          bricks
        }
      ],
      isFetching: false
    }
  }

  if (action.type === PROJECT_UPDATE && action.payload.brick.type !== 'LOADBALANCER') {
    const bricks = updateBricks(state.stacks[0].bricks, [action.payload.brick])
    return {
      ...state,
      stacks: [
        {
          bricks
        }
      ],
      isFetching: false
    }
  }

  // TODO refactor and DRY this
  // TODO UT
  if (action.type === AUTH_RESET) {
    const nextProjectConfig = {}
    if (state.id) {
      nextProjectConfig.id = state.id
    }
    if (state.project) {
      nextProjectConfig.project = {
        id: state.project.id
      }
    }
    return nextProjectConfig
  }

  return state
}

export const getAggregatedStackStatus = (state) => {
  if (state && state.stacks && state.stacks[0] && state.stacks[0].bricks) {
    return computeAggregatedStackStatus(state.stacks[0].bricks)
  }
  return {}
}

export const getProjectConfigName = (state) => {
  if (state && state.name) {
    return state.name
  }
  return ''
}
