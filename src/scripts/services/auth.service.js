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

const authService = {}

/**
 * Check auth & redirect to login page
 *
 * @param nextState
 * @param replaceState
 * @returns {boolean}
 */
authService.checkAuth = (nextState, replaceState) => {
  const isAuthenticated = authService.isAuth()

  // TODO return the targeted url to pass it to login, in order to reroute to it after login
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
 * @param login
 * @param password
 * @returns {string} tokenize auth
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
 * @param id {string} user identifier
 * @param userName {string} user name
 */
authService.putAuth = (id, userName) => {
  storageService.put('isAuthenticated', true, 'session')
  storageService.put('userId', id, 'session')
  storageService.put('userName', userName, 'session')
}

/**
 * Reset authentication
 */
authService.resetAuth = () => {
  storageService.remove('token', 'session')
  storageService.remove('isAuthenticated', 'session')
  storageService.remove('userId', 'session')
  storageService.remove('userName', 'session')
}

/**
 * Return authenticated state
 *
 * @returns {boolean}
 */
authService.isAuth = () => !!storageService.get('isAuthenticated', 'session')

/**
 * Return token
 *
 * @returns {string} token
 */
authService.getToken = () => storageService.get('token', 'session') || ''

/**
 * Return user id and password
 *
 * @returns {object} account
 */
authService.getAccount = () => (
  {
    id: storageService.get('userId', 'session'),
    userName: storageService.get('userName', 'session'),
    password: authService.getToken()
  }
)

/**
 * Return encrypted basic auth string
 *
 * @param auth {string}
 * @returns {string}
 */
authService.encryptBasicAuth = (auth) => btoa(auth)

/**
 * Return decrypted basic auth string
 *
 * @param auth {string}
 * @returns {string}
 */
authService.decryptBasicAuth = (auth) => atob(auth)

// public API
export const checkAuth = authService.checkAuth
export const setAuth = authService.setAuth
export const putAuth = authService.putAuth
export const resetAuth = authService.resetAuth
export const isAuth = authService.isAuth
export const getToken = authService.getToken
export const getAccount = authService.getAccount

// service
export default authService
