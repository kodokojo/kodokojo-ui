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

import merge from 'lodash/merge'

import { getToken } from './auth.service'

const ioService = {}

/**
 * Return a headers object that merge basic, auth and param header object
 *
 * @param header {object} headers to add or overwrite
 * @returns {object} headers
 */
ioService.getHeaders = (header) => {
  const token = getToken()
  return merge(
    {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    header,
    token ? { Authorization: `Basic ${token}` } : {}
  )
}

// public API
export const getHeaders = ioService.getHeaders

export default ioService
