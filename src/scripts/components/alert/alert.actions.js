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
import isEmpty from 'lodash/isEmpty'

// TODO UT

import {
  ALERT_ACTIVE_CLEAN,
  ALERT_ACTIVE_HIDE,
  ALERT_ACTIVE_REPLACE,
  ALERT_ACTIVE_SHOW,
  ALERT_ADD,
  ALERT_REMOVE
} from '../../commons/constants'

export function addAlert(alert) {
  return {
    type: ALERT_ADD,
    payload: {
      alert
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

export function cleanAlert() {
  return {
    type: ALERT_ACTIVE_CLEAN
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

export function newAlert(alert) {
  return (dispatch, getState) => dispatch(addAlert(alert))
    .then(data => {
      const { alerts } = getState()

      if (alerts.list.length <= 1 && isEmpty(alerts.display)) {
        dispatch(replaceAlert(alerts.list[0].id))
      }
    })
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
      
      // 600ms is the animation time for an alert (in toaster) to play hide and show animation
      if (alerts[nextAlertIndex] !== undefined) {
        setTimeout(() => {
          return Promise.resolve(dispatch(replaceDisplayAlert(alerts[nextAlertIndex].id)))
        }, 600)
      }
      return Promise.resolve()
    })
    .then(data => dispatch(removeAlert(alertId)))
    .then(data => {
      const { alerts } = getState()

      // if there is no more alerts, clean displayed alert
      // 600ms is the animation time for an alert (in toaster) to play hide and show animation
      if (alerts.list.length === 0) {
        setTimeout(() => {
          return Promise.resolve(dispatch(cleanAlert()))
        }, 600)
      }
      return Promise.resolve()
    })
    .catch(error => Promise.reject(error.message || error))
}
