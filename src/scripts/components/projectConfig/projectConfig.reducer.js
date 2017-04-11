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

import findIndex from 'lodash/findIndex'

import storageService from '../../services/storage.service'
import { updateBricks, computeAggregatedStackStatus, removeUsers } from '../../services/stateUpdater.service'
import {
  AUTH_RESET,
  ORGANISATION_CHANGE,
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
  let initialState
  const initialProjectConfig = {
    id: storageService.get('projectConfigId')
  }
  const project = {
    id: storageService.get('projectId')
  }
  if (project.id) {
    initialProjectConfig.project = project
  }
  if (initialProjectConfig && initialProjectConfig.id) {
    initialState = {
      [initialProjectConfig.id]: initialProjectConfig
    }
  }
  return {
    list: {
      ...initialState
    },
    isFetching: false
  }
}

export default function projectConfig(state = projectConfigReducerInit(), action) {
  if (
    action.type === PROJECT_CONFIG_NEW_REQUEST ||
    action.type === PROJECT_CONFIG_REQUEST
  ) {
    return {
      ...state,
      isFetching: true
    }
  }

  if (
    action.type === PROJECT_CONFIG_NEW_SUCCESS ||
    action.type === PROJECT_CONFIG_SUCCESS
  ) {
    const projectConfig = action.payload.projectConfig

    return {
      ...state,
      list: {
        ...state.list,
        [projectConfig.id]: projectConfig
      },
      isFetching: false
    }
  }

  if (
    action.type === PROJECT_CONFIG_NEW_FAILURE ||
    action.type === PROJECT_CONFIG_FAILURE
  ) {
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
    const projectConfig = state.list[action.payload.projectConfigId]

    if (projectConfig && projectConfig.users) {
      users = removeUsers(projectConfig.users, action.payload.usersToDelete)
    }

    return {
      ...state,
      list: {
        ...state.list,
        [projectConfig.id]: {
          ...projectConfig,
          users
        }
      },
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
    const projectConfig = state.list[action.payload.project.projectConfigId]

    if (
      projectConfig &&
      action.payload.project &&
      action.payload.project.stacks &&
      action.payload.project.stacks[0] &&
      action.payload.project.stacks[0].bricks
    ) {
      bricks = updateBricks(projectConfig.stacks[0].bricks, action.payload.project.stacks[0].bricks)
    }

    return {
      ...state,
      list: {
        ...state.list,
        [projectConfig.id]: {
          ...projectConfig,
          project: {
            id: action.payload.project.id,
            updateDate: action.payload.project.updateDate
          },
          stacks: [
            {
              bricks
            }
          ]
        }
      },
      isFetching: false
    }
  }

  if (
    action.type === PROJECT_UPDATE &&
    action.payload.brick.type !== 'LOADBALANCER'
  ) {
    let bricks
    const projectConfigId = action.payload.brick.projectConfigId
    const projectConfig = state.list[projectConfigId]

    if (projectConfig && projectConfig.stacks && projectConfig.stacks[0]) {
      bricks = updateBricks(projectConfig.stacks[0].bricks, [action.payload.brick])
    }

    return {
      ...state,
      list: {
        ...state.list,
        [projectConfigId]: {
          ...state.list[projectConfigId],
          stacks: [
            {
              ...state.list[projectConfigId].stacks[0],
              bricks
            }
          ]
        }
      },
      isFetching: false
    }
  }

  if (action.type === ORGANISATION_CHANGE) {
    return {
      ...state,
      list: {}
    }
  }

  // TODO refactor and DRY this
  // TODO UT
  // if (action.type === AUTH_RESET) {
  //   const nextProjectConfig = {}
  //   if (state.id) {
  //     nextProjectConfig.id = state.id
  //   }
  //   if (state.project) {
  //     nextProjectConfig.project = {
  //       id: state.project.id
  //     }
  //   }
  //   return nextProjectConfig
  // }

  return state
}

export const getAggregatedStackStatus = (state, projectConfigId) => {
  const projectConfig = state.list[projectConfigId]

  if (projectConfig && projectConfig.stacks && projectConfig.stacks[0] && projectConfig.stacks[0].bricks) {
    return computeAggregatedStackStatus(projectConfig.stacks[0].bricks)
  }
  return {}
}

export const getProjectConfigUsers = (state, projectConfigId) => {
  const projectConfig = state.list[projectConfigId]

  if (projectConfig) {
    return projectConfig.users
  }
  return []
}

export const getProjectConfigStacks = (state, projectConfigId) => {
  const projectConfig = state.list[projectConfigId]

  if (projectConfig) {
    return projectConfig.stacks
  }
  return []
}

export const getProjectConfigs = (state) => {
  return Object.values(state.list)
}
