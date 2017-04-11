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

// import { user } from '../../commons/schemas'
import authService from '../../services/auth.service'
import storageService from '../../services/storage.service'
import { requestAuthentication, resetAuthentication } from '../auth/auth.actions'
import { eventStop } from '../event/event.actions'
import { newAlert } from '../alert/alert.actions'
import { routeToContext } from '../navigation/navigation.actions'
import crispService from '../../services/crisp.service'

export function login(username, password) {
  if (username && password) {
    authService.setAuth(username, password)
  }
  return (dispatch, getState) => dispatch(requestAuthentication())
    .then(data => {
      if (!data.error) {
        const { prefs, routing, context } = getState()

        // put auth
        authService.putAuth(data.payload.account)

        // TODO UT
        // optional feature
        if (
          prefs &&
          prefs.configuration &&
          prefs.configuration.ui &&
          prefs.configuration.ui.CRISP
        ) {
          // put user in scrip
          crispService.putUser(data.payload.account)
        }

        // route user depending of context
        return dispatch(routeToContext(routing, context))
      }
      throw new Error(data.payload.status)
    })
    .catch(error => {
      throw new Error(error.message || error)
    })
}

export function logout(reason) {
  return dispatch => dispatch(resetAuthentication())
    .then(data => {
      if (!data.error) {
        // reset auth
        authService.resetAuth()
        storageService.clean()
        return dispatch(eventStop())
          .then(() => {
            // TODO update UT
            if (reason) {
              const alert = {
                icon: 'question_answer',
                labelId: reason,
                label: 'id',
                timeout: 30000,
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
