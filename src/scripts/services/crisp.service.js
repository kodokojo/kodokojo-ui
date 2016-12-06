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

const crispService = {
  crisp: undefined
}

crispService.inject = () => {
  const head = document.head || document.getElementsByTagName('head')[0]
  const script = document.createElement('script')
  script.id = 'script-crisp'
  script.src = 'https://client.crisp.im/l.js'
  script.type = 'text/javascript'
  script.async = true
  script.defer = true
  script.onerror = (oError) => {
    throw new URIError(`The script ${oError.target.src} is not accessible.`)
  }
  head.appendChild(script)
}

crispService.init = () => {
  crispService.crisp = window.$crisp
}

crispService.putUser = (account) => {
  if (!crispService.crisp) {
    crispService.init()
  }

  if (account.email) {
    crispService.crisp.set('user:email', account.email)
  }

  if (account.firstName && account.lastName) {
    crispService.crisp.set('user:nickname', `${account.firstName} ${account.lastName}`)
  }
}

crispService.init()

// private API
export const init = crispService.init
export const inject = crispService.inject

// public API
export const putUser = crispService.putUser

export default crispService