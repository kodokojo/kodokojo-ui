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
