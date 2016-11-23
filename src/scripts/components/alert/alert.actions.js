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
