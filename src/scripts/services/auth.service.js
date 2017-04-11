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

import storageService from './storage.service'
import { getGroupByLabel } from './param.service'

const authService = {}

// TODO UT
/**
 * Check if user belongs to user group USER
 * @param {Object} nextState
 * @param {Function} replaceState
 * @returns {Boolean}
 */
authService.checkRightsUser = (nextState, replaceState) => authService.checkRights(nextState, replaceState, 'USER')

// TODO UT
/**
 * Check if user belongs to user group TEAM_LEADER
 * @param {Object} nextState
 * @param {Function} replaceState
 * @returns {Boolean}
 */
authService.checkRightsTeamLeader = (nextState, replaceState) => authService.checkRights(nextState, replaceState, 'TEAM_LEADER')

// TODO UT
/**
 * Check if user belongs to user group ADMIN
 * @param {Object} nextState
 * @param {Function} replaceState
 * @returns {Boolean}
 */
authService.checkRightsAdmin = (nextState, replaceState) => authService.checkRights(nextState, replaceState, 'ADMIN')

// TODO UT
/**
 * Check if user belongs to user group ROOT
 * @param {Object} nextState
 * @param {Function} replaceState
 * @returns {Boolean}
 */
authService.checkRightsRoot = (nextState, replaceState) => authService.checkRights(nextState, replaceState, 'ROOT')

// TODO UT
/**
 * Check if user belongs to user group
 *
 * @param {Object} nextState
 * @param {Function} replaceState
 * @param {String} groupLabel
 * @returns {Boolean}
 */
authService.checkRights = (nextState, replaceState, groupLabel) => {
  checkAuth(nextState, replaceState)
  const hasRights = authService.hasRights(groupLabel)
  if (!hasRights) {
    // use react router onEnter callback argument to replace router state
    replaceState({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }

  return hasRights
}

/**
 * Check auth & redirect to login page
 *
 * @param {Object} nextState
 * @param {Object} replaceState
 * @returns {Boolean}
 */
authService.checkAuth = (nextState, replaceState) => {
  const isAuthenticated = authService.isAuth()

  // redirect to login if not authenticated
  if (!isAuthenticated) {
    storageService.clean()

    // use react router onEnter callback argument to replace router state
    replaceState({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }

  return isAuthenticated
}

/**
 * Return encrypted authentication
 *
 * @param {String} login
 * @param {String} password
 * @returns {String} tokenize auth
 */
authService.setAuth = (login, password) => {
  if (login && password) {
    const token = authService.encryptBasicAuth(`${login}:${password}`)
    storageService.put('token', token, 'session')
    return token
  }
  return ''
}

/**
 * Put authentication
 *
 * @param {Object} account
 */
authService.putAuth = (account) => {
  storageService.put('userId', account.id, 'session')
  storageService.put('userName', account.userName, 'session')
  storageService.put('isAuthenticated', true, 'session')
}

/**
 * Put user group
 *
 * @param {String} group
 */
authService.putGroup = (group) => {
  storageService.put('userGroup', group, 'session')
}

/**
 * Return user group
 *
 * @returns {String} group
 */
authService.getGroup = () => storageService.get('userGroup', 'session') || ''

/**
 * Reset authentication
 */
authService.resetAuth = () => {
  storageService.remove('userId', 'session')
  storageService.remove('userName', 'session')
  storageService.remove('isAuthenticated', 'session')
  storageService.remove('token', 'session')
  storageService.remove('userGroup', 'session')
}

/**
 * Return authenticated state
 *
 * @returns {Boolean}
 */
authService.isAuth = () => !!storageService.get('isAuthenticated', 'session')

/**
 * Return token
 *
 * @returns {String} token
 */
authService.getToken = () => storageService.get('token', 'session') || ''

// TODO UT
/**
 * Return basic auth
 *
 * @returns {String} basic auth
 */
authService.getBasicAuth = () => authService.decryptBasicAuth(authService.getToken())

/**
 * Return user account
 *
 * @returns {Object} account
 */
authService.getAccount = () => (
  {
    id: storageService.get('userId', 'session'),
    userName: storageService.get('userName', 'session'),
    group: storageService.get('userGroup', 'session'),
    token: authService.getToken()
  }
)

// TODO UT
/**
 * Return if user has user rights
 *
 * @returns {Boolean}
 */
authService.hasRights = (groupLabel, userGroupLabel) => {
  const targetGroup = getGroupByLabel(groupLabel)
  const userGroup = getGroupByLabel(authService.getGroup() || userGroupLabel)
  if (
    targetGroup &&
    targetGroup.id !== undefined &&
    userGroup &&
    userGroup
  ) {
    return userGroup.id >= targetGroup.id
  }
  return false
}

/**
 * Return encrypted basic auth string
 *
 * @param auth {String}
 * @returns {String}
 */
authService.encryptBasicAuth = (auth) => btoa(auth)

// TODO UT
/**
 * Return decrypted basic auth string
 *
 * @param auth {String}
 * @returns {String}
 */
authService.decryptBasicAuth = (auth) => atob(auth)

// public API
export const checkRightsUser = authService.checkRightsUser
export const checkRightsTeamLeader = authService.checkRightsTeamLeader
export const checkRightsAdmin = authService.checkRightsAdmin
export const checkRightsRoot = authService.checkRightsRoot
export const checkRights = authService.checkRights
export const checkAuth = authService.checkAuth
export const setAuth = authService.setAuth
export const putAuth = authService.putAuth
export const resetAuth = authService.resetAuth
export const isAuth = authService.isAuth
export const getToken = authService.getToken
export const getBasicAuth = authService.getBasicAuth
export const getAccount = authService.getAccount
export const putGroup = authService.putGroup
export const getGroup = authService.getGroup
export const hasRights = authService.hasRights

// service
export default authService
