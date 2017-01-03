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

const errorService = {}

/**
 * Return error key to be parsed with react-intl
 *
 * @param {object} param
 * @param {string} param.component
 * @param {string} param.action
 * @param {string} param.code
 * @returns {string} error i18n key
 */
errorService.returnErrorKey = ({ component, action, code }) => `${component ? `${component}-` : ''}` +
  `${action ? `${action}-` : ''}error` +
  `${code ? `-${code}` : ''}`

/**
 * @param {object} param
 * @param {string} param.component
 * @param {string} param.action
 * @param {string} param.message
 * @returns {string} error i18n key or message
 */
errorService.returnErrorKeyOrMessage = ({ component, action, message }) => {
  if (message && message.match(/^((?:4|5){1}\d{2})$/)) {
    return errorService.returnErrorKey({ component, action, code: message })
  } else {
    return message
  }
}

// public API
export const returnErrorKey = errorService.returnErrorKey
export const returnErrorKeyOrMessage = errorService.returnErrorKeyOrMessage

export default errorService
