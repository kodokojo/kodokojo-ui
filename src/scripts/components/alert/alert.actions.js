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

import Promise from 'bluebird'
import sortBy from 'lodash/sortBy'
import findIndex from 'lodash/findIndex'

// TODO UT

import {
  ALERT_ACTIVE_HIDE,
  ALERT_ACTIVE_REPLACE,
  ALERT_ACTIVE_SHOW,
  ALERT_ADD,
  ALERT_REMOVE
} from '../../commons/constants'

export function addAlert(alertId) {
  return {
    type: ALERT_ADD,
    payload: {
      alertId
    }
  }
}

export function removeAlert(alertId) {
  return {
    type: ALERT_REMOVE,
    payload: {
      alertId
    }
  }
}

export function hideAlert(alertId) {
  return {
    type: ALERT_ACTIVE_HIDE,
    payload: {
      alertId
    }
  }
}

export function showAlert(alertId) {
  return {
    type: ALERT_ACTIVE_SHOW,
    payload: {
      alertId
    }
  }
}

export  function replaceAlert(alertId) {
  return {
    type: ALERT_ACTIVE_REPLACE,
    payload: {
      alertId
    }
  }
}

export  function replaceDisplayAlert(alertId) {
  return dispatch => dispatch(replaceAlert(alertId))
    .then(data => dispatch(showAlert(data.payload.alertId)))
}

export function nextAlert(alertId) {
  return (dispatch, getState) => dispatch(hideAlert(alertId))
    .then(data => {
      let { alerts } = getState()

      alerts = sortBy(alerts.list, 'id') 
      const alertIndex = findIndex(alerts, { 'id': alertId })
      const nextAlertIndex = alertIndex + 1
      
      return new Promise((resolve, reject) => {
        if (alerts[nextAlertIndex] !== undefined) {
          setTimeout(() => {
            resolve(dispatch(replaceDisplayAlert(alerts[nextAlertIndex].id)))
          }, 600)
        } else {
          resolve()
        }
      })
    })
    .then(data => dispatch(removeAlert(alertId)))
    .catch(error => Promise.reject(error.message || error))
}
