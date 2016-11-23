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

import { CALL_API } from 'redux-api-middleware'
import Promise from 'bluebird'

import api from '../../commons/config'
import { getHeaders } from '../../services/io.service'
import { mapProject } from '../../services/mapping.service'
import { newAlert } from '../alert/alert.actions'
import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE,
  PROJECT_NEW_REQUEST,
  PROJECT_NEW_SUCCESS,
  PROJECT_NEW_FAILURE,
  PROJECT_UPDATE
} from '../../commons/constants'

export function fetchProject(projectId) {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
      `${window.location.protocol || 'http:'}//` +
      `${window.location.host || 'localhost'}${api.project}/${projectId}`,
      headers: getHeaders(),
      types: [
        PROJECT_REQUEST,
        {
          type: PROJECT_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(project => (
              {
                project: mapProject(project)
              }
            )
          )
        },
        PROJECT_FAILURE
      ]
    }
  }
}

export function getProject(projectId) {
  return dispatch => dispatch(fetchProject(projectId))
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

export function requestNewProject(projectConfigId) {
  return {
    [CALL_API]: {
      method: 'POST',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.project}/${projectConfigId}`,
      headers: getHeaders(),
      types: [
        PROJECT_NEW_REQUEST,
        {
          type: PROJECT_NEW_SUCCESS,
          payload: (action, state, res) => res.text()
            .then(id => (
              {
                project: {
                  id
                }
              }
            ))
        },
        PROJECT_NEW_FAILURE
      ]
    }
  }
}

export function createProject(projectConfigId) {
  return dispatch => dispatch(requestNewProject(projectConfigId))
    .then(data => {
      if (!data.error) {
        // TODO update UT
        const alert = {
          icon: 'question_answer',
          label: 'id',
          labelId: 'alert-stack-starting-text',
          timeout: 2000,
          variant: 'warning'
        }
        dispatch(newAlert(alert))

        return dispatch(getProject(data.payload.project.id))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function updateProject(event) {
  return {
    type: PROJECT_UPDATE,
    payload: event
  }
}
