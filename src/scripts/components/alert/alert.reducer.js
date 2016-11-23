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

const initialState = {
  display: {},
  list: []
}

export default function alerts(state = initialState, action) {
  if (action.type === ALERT_ADD) {
    const alerts = sortBy(state.list, 'id')

    const alertId = alerts.length > 0 ? sortBy(alerts, 'id')[alerts.length - 1].id + 1 : 0
    let alert = {
      id: alertId,
      action: action.payload.action,
      active: false,
      icon: action.payload.icon,
      label: action.payload.label,
      timeout: action.payload.timeout,
      toasterVariant: action.payload.toasterVariant
    }
    alert = alert.filter(key => key !== undefined)
    alerts.push(alert)
    
    return {
      ...state,
      list: alerts
    }
  }

  if (action.type === ALERT_REMOVE) {
    const alerts = sortBy(state.list, 'id')
    const alertIndex = findIndex( alerts, { 'id': action.payload.alertId })
    alerts.splice(alertIndex, 1)

    console.log('remove', alertIndex)
    return {
      ...state,
      list: alerts
    }
  }

  if (action.type === ALERT_ACTIVE_SHOW) {
    const { display } = state
    display.active = true
    
    return {
      ...state,
      display: display
    }
    // return state
  }

  if (action.type === ALERT_ACTIVE_HIDE) {
    const { display } = state
    display.active = false
    
    return {
      ...state,
      display: display
    }
    // return state
  }

  if (action.type === ALERT_ACTIVE_REPLACE) {
    const alertIndex = findIndex(state.list, { 'id': action.payload.alertId })
    console.log('replace', alertIndex)

    return {
      display: state.list[alertIndex],
      list: sortBy(state.list, 'id')
    }
  }

  return state
}
