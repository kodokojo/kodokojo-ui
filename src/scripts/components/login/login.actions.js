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
// import { user } from '../../commons/schemas'
import authService from '../../services/auth.service'
import storageService from '../../services/storage.service'
import ioService from '../../services/io.service'
import { mapAccount } from '../../services/mapping.service'
import { getProjectConfigAndProject } from '../projectConfig/projectConfig.actions'
import { requestWebsocket, stopWebsocket } from '../_utils/websocket/websocket.actions'
import { newAlert } from '../alert/alert.actions'
import crispService from '../../services/crisp.service'
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_RESET
} from '../../commons/constants'

export function requestAuthentication() {
  return {
    [CALL_API]: {
      method: 'GET',
      endpoint:
        `${window.location.protocol || 'http:'}//` +
        `${window.location.host || 'localhost'}${api.user}`,
      headers: ioService.getHeaders(),
      types: [
        AUTH_REQUEST,
        {
          type: AUTH_SUCCESS,
          payload: (action, state, res) => res.json()
            .then(account => (
              {
                account: mapAccount(account)
              }
            ))
        },
        AUTH_FAILURE
      ]
      // schema: user
    }
  }
}

export function login(username, password) {
  if (username && password) {
    authService.setAuth(username, password)
  }
  return (dispatch, getState) => dispatch(requestAuthentication())
    .then(data => {
      if (!data.error) {
        const { prefs, routing } = getState()

        // put auth
        authService.putAuth(data.payload.account.id, data.payload.account.userName)

        // TODO UT
        // optional feature
        if (prefs && prefs.configuration && prefs.configuration.ui && prefs.configuration.ui.CRISP) {
          // put user in scrip
          crispService.putUser(data.payload.account)
        }

        // if route exist before accessing login, reroute to it
        if (
          routing && routing.locationBeforeTransitions &&
          routing.locationBeforeTransitions.state && routing.locationBeforeTransitions.state.nextPathname
        ) {
          return dispatch(requestWebsocket())
            .then(() => Promise.resolve(browserHistory.push(routing.locationBeforeTransitions.state.nextPathname)))
        } else if (data.payload.account.projectConfigIds.length) {
          const projectConfig = data.payload.account.projectConfigIds[0]

          if (projectConfig.projectId) {
            // get project config and project and redirect to project
            return dispatch(
              getProjectConfigAndProject(projectConfig.projectConfigId, projectConfig.projectId))
                .then(dispatch(requestWebsocket()))
                .then(Promise.resolve(browserHistory.push('/stacks')))
          }
          if (!projectConfig.projectId) {
            // TODO second case, project config has no project id
            // must redirect to project config stack, with a button to start it
            return dispatch(requestWebsocket())
          }
        }
        // if no ids, redirect to first project
        return dispatch(requestWebsocket())
          .then(() => Promise.resolve(browserHistory.push('/firstProject')))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function resetAuthentication() {
  return {
    type: AUTH_RESET
  }
}

export function logout(reason) {
  return dispatch => dispatch(resetAuthentication())
    .then(data => {
      if (!data.error) {
        // reset auth
        authService.resetAuth()
        storageService.clean()
        return dispatch(stopWebsocket())
          .then(() => {
            // TODO update UT
            if (reason) {
              const alert = {
                icon: 'question_answer',
                labelId: reason,
                label: 'id',
                timeout: 2000,
                variant: 'info'
              }
              dispatch(newAlert(alert))
            }

            return Promise.resolve(browserHistory.push('/login'))
          })
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}
