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

  if (!isAuthenticated) {
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
