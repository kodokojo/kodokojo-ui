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

import request from 'request'
import Promise from 'bluebird'
import logger from '../config/logger'

const requestPromise = Promise.promisify(request, { multiArgs: true })

export const requestWithLog = (options) => {
  let startMessage = `${options.method} request on uri ${options.uri}`
  if (options.headers) {
    startMessage += `\n Headers : ${JSON.stringify(options.headers, null, 2)}`
  }
  if (options.body) {
    startMessage += `\n Body : ${JSON.stringify(options.body, null, 2)}`
  }

  return requestPromise(options)
    .spread((res, data) => {
      logger.debug(startMessage)
      logger.debug(JSON.stringify(res, null, 2))
      return {
        res,
        data
      }
    })
    .catch((error, response, body) => {
      logger.error(startMessage)
      logger.error(JSON.stringify(error, null, 2))
      throw error
    })
}

export const getRequestProtocol = (req) => `${req.protocol}://`
