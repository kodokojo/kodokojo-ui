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

import { browserHistory } from 'react-router'
import { CALL_API } from 'redux-api-middleware'
import Promise from 'bluebird'

import api from '../../commons/config'
import { getHeaders } from '../../services/io.service'
import { mapProjectConfig, mapProjectConfigOutput } from '../../services/mapping.service'
import { logout } from '../login/login.actions'
import { createUser, getUser } from '../user/user.actions'
import { createProject, getProject } from '../project/project.actions'
import { newAlert } from '../alert/alert.actions'
import { getAuthUserProjectConfigs } from '../../commons/reducers'
import {
  PROJECT_CONFIG_CHANGE,
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
  PROJECT_CONFIG_LIST_RESET
} from '../../commons/constants'

export function fetchProjectConfig(projectConfigId) {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.projectConfig}/${projectConfigId}`,
      headers: getHeaders(),
      types: [
        PROJECT_CONFIG_REQUEST,
        {
          type: PROJECT_CONFIG_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(projectConfig => (
              {
                projectConfig: mapProjectConfig(projectConfig)
              }
            ))
        },
        PROJECT_CONFIG_FAILURE
      ]
    }
  }
}

export function getProjectConfig(projectConfigId) {
  return (dispatch, getState) => dispatch(fetchProjectConfig(projectConfigId))
    .then(data => {
      if (!data.error) {
        return dispatch(updateProjectConfigContext(data.payload.projectConfig))
      }
      // TODO put this to error service?
      if (data.error && data.payload.status && data.payload.status === 401) {
        dispatch(logout())
      }
      throw new Error(data.payload.status)
    })
    .then(() => {
      const promises = []
      const { projectConfig } = getState()
      const contextProjectConfig = projectConfig.list[projectConfigId]
      if (contextProjectConfig && contextProjectConfig.users) {
        contextProjectConfig.users.forEach((userId) => {
          promises.push(dispatch(getUser(userId)))
        })
        return Promise.all(promises)
      }
      return Promise.resolve()
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function getProjectConfigList(organisationId) {
  return (dispatch, getState) => dispatch(resetProjectConfigList())
    .then(() => {
      const projectConfigs = getAuthUserProjectConfigs(getState(), organisationId)

      if (projectConfigs && projectConfigs.length && projectConfigs.length > 0) {
        projectConfigs.forEach(projectConfig => {
          return dispatch(fetchProjectConfig(projectConfig.id))
            .then(data => {
              if (!data.error && projectConfig.project && projectConfig.project.id) {
                return dispatch(getProject(projectConfig.project.id))
              }

              throw new Error(data.payload.status)
            })
            .catch(error => {
              throw new Error(error.message || error)
            })
        })
      }

      return Promise.resolve()
    })
}

export function resetProjectConfigList() {
  return {
    type: PROJECT_CONFIG_LIST_RESET
  }
}

// TODO UT
export function getProjectConfigAndProject(projectConfigId, projectId) {
  return dispatch => dispatch(getProjectConfig(projectConfigId))
    .then(data => {
      if (!data.error) {
        return dispatch(getProject(projectId))
      }
      throw new Error(data.payload.status)
    })
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

export function requestProjectConfig(projectConfig) {
  return {
    [CALL_API]: {
      method: 'POST',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.projectConfig}`,
      headers: getHeaders(),
      body: JSON.stringify(mapProjectConfigOutput(projectConfig)),
      types: [
        PROJECT_CONFIG_NEW_REQUEST,
        {
          type: PROJECT_CONFIG_NEW_SUCCESS,
          payload: (action, state, res) => res.text()
            .then(id => (
              {
                projectConfig: {
                  id
                }
              }
            ))
        },
        PROJECT_CONFIG_NEW_FAILURE
      ]
    }
  }
}

export function createProjectConfig(projectConfig) {
  return (dispatch, getState) => dispatch(requestProjectConfig(projectConfig))
    .then(data => {
      if (!data.error) {
        return dispatch(updateProjectConfigContext(data.payload.projectConfig))
      }
      throw new Error(data.payload.status)
    })
    .then(data => {
      const { context } = getState()
      if (!data.error) {
        return dispatch(getProjectConfig(context.projectConfig.id))
      }
      throw new Error(data.payload.status)
    })
    .then(data => {
      const { context } = getState()
      if (!data.error) {
        return dispatch(createProject(context.projectConfig.id))
      }
      throw new Error(data.payload.status)
    })
    .then(data => {
      if (!data.error) {
        return Promise.resolve(browserHistory.push('/stacks'))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function changeProjectConfig(projectConfig) {
  return {
    type: PROJECT_CONFIG_CHANGE,
    projectConfig
  }
}

// TODO UT
export function updateProjectConfigContext(projectConfig) {
  return (dispatch) => dispatch(changeProjectConfig(projectConfig))
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

export function requestAddUserToProjectConfig(projectConfigId, userId) {
  return {
    [CALL_API]: {
      method: 'PUT',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.projectConfig}/${projectConfigId}${api.projectConfigUser}`,
      headers: getHeaders(),
      body: JSON.stringify([userId]),
      types: [
        PROJECT_CONFIG_ADD_USER_REQUEST,
        PROJECT_CONFIG_ADD_USER_SUCCESS,
        PROJECT_CONFIG_ADD_USER_FAILURE
      ]
    }
  }
}

export function addUserToProjectConfig(projectConfigId, user) {
  // TODO search user and if does not exist, create it
  return dispatch => dispatch(createUser(user))
    .then(data => {
      if (!data.error) {
        return dispatch(requestAddUserToProjectConfig(projectConfigId, data.payload.account.id))
      }
      throw new Error(data.payload.status)
    })
    .then(data => {
      if (!data.error) {
        const alert = {
          icon: 'question_answer',
          labelId: 'alert-member-create-text',
          label: 'id',
          timeout: 30000,
          variant: 'info'
        }
        dispatch(newAlert(alert))

        return dispatch(getProjectConfig(projectConfigId))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function requestDeleteMembers(projectConfigId, userIdList) {
  return {
    [CALL_API]: {
      method: 'DELETE',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.projectConfig}/${projectConfigId}${api.projectConfigUser}`,
      headers: getHeaders(),
      body: JSON.stringify(userIdList),
      types: [
        PROJECT_CONFIG_DELETE_USERS_REQUEST,
        {
          type: PROJECT_CONFIG_DELETE_USERS_SUCCESS,
          payload: {
            projectConfigId,
            usersToDelete: userIdList
          }
        },
        PROJECT_CONFIG_DELETE_USERS_FAILURE
      ]

      // schema: user
    }
  }
}

export function deleteUsersFromProjectConfig(projectConfigId, userIdList) {
  return dispatch => dispatch(requestDeleteMembers(projectConfigId, userIdList))
    .then(data => {
      if (!data.error) {
        return Promise.resolve()
      }
      throw new Error(data.payload.status)
    })
    .catch(error => Promise.reject(error.message || error))
}
