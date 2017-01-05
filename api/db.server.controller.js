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

import * as dbRepository from './db.server.repository'

export const getEntries = (request, response) => {
  dbRepository
    .getEntries(request)
    .then(res => response.status(200).send(res.body))
    .catch(err => response.status(err.response && err.response.statusCode ? err.response.statusCode : 500).send(err))
}

export const getEntry = (request, response) => {
  dbRepository
    .getEntry(request)
    .then(res => response.status(200).send(res.body))
    .catch(err => response.status(err.response && err.response.statusCode ? err.response.statusCode : 500).send(err))
}
