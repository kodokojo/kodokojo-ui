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

import config from '../config/config'
import logger from '../config/logger'

import { requestWithLog } from './utils.server.service'

const userRepository = {}

userRepository.initUser = (request) => {
  logger.debug('initUser')

  const { headers } = {
    headers: request.headers
  }
  headers.host = config.api.host

  return requestWithLog({
    method: 'POST',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.user}`,
    json: true,
    headers,
    rejectUnauthorized: false,
    requestCert: true
  })
}

userRepository.updateUser = (request) => {
  logger.debug('updateUser')

  const { identifier, firstName, lastName, password, sshPublicKey, email, headers } = {
    identifier: request.params.userId,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    password: request.body.password,
    sshPublicKey: request.body.sshPublicKey,
    email: request.body.email,
    headers: request.headers
  }
  headers.host = config.api.host
  delete headers.referer
  delete headers.origin

  return requestWithLog({
    method: 'PATCH',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.user}/${identifier}`,
    json: true,
    headers,
    body: {
      firstName,
      lastName,
      email,
      password,
      sshPublicKey
    },
    rejectUnauthorized: false,
    requestCert: true
  })
}

userRepository.postUser = (request) => {
  logger.debug('postUser')

  const { id, email, entity, headers } = {
    id: request.params.id,
    email: request.body.email,
    entity: request.body.entity,
    headers: request.headers
  }
  headers.host = config.api.host

  return requestWithLog({
    method: 'POST',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.user}/${id}`,
    json: true,
    headers,
    body: {
      email,
      entity
    },
    rejectUnauthorized: false,
    requestCert: true
  })
}

userRepository.getUserAccount = (request) => {
  logger.debug('getUserAccount')

  const { headers } = {
    headers: request.headers
  }
  headers.host = config.api.host

  return requestWithLog({
    method: 'GET',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.user}`,
    json: true,
    headers,
    rejectUnauthorized: false,
    requestCert: true
  })
}

userRepository.getUser = (request) => {
  logger.debug('getUserAccount')

  const { headers, userId } = {
    headers: request.headers,
    userId: request.params.userId
  }
  headers.host = config.api.host

  return requestWithLog({
    method: 'GET',
    uri: `${config.api.protocol}${config.api.host}${config.api.routes.user}/${userId}`,
    headers,
    json: true,
    rejectUnauthorized: false,
    requestCert: true
  })
}

// Public methods
export const initUser = userRepository.initUser
export const postUser = userRepository.postUser
export const updateUser = userRepository.updateUser
export const getUserAccount = userRepository.getUserAccount
export const getUser = userRepository.getUser

// Service instance
export default userRepository
