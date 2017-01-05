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

import config from '../config/config'
import logger from '../config/logger'

import { requestWithLog } from './utils.server.service'

const dbRepository = {}

dbRepository.getEntries = (request) => {
  logger.debug('getEntries')

  const { headers } = {
    headers: request.headers
  }
  headers.host = config.api.host

  return requestWithLog({
    method: 'GET',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.db}`,
    json: true,
    headers,
    rejectUnauthorized: false,
    requestCert: true
  })
}

dbRepository.getEntry = (request) => {
  logger.debug('getEntry')
  
  const { headers, entryId } = {
    headers: request.headers,
    entryId: request.params.entryId
  }
  headers.host = config.api.host

  return requestWithLog({
    method: 'GET',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.db}/${entryId}`,
    json: true,
    headers,
    rejectUnauthorized: false,
    requestCert: true
  })
}

// Public API
export const getEntries = dbRepository.getEntries
export const getEntry = dbRepository.getEntry

// Service instance
export default dbRepository
