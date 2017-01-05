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

import api from '../shared/api.endpoints'

/**
 * Set docker host to route api io
 */
let localApiProtocol
let localApiHost
const dockerHost = process.env.DOCKER_HOST

if (dockerHost && dockerHost.match(/^tcp:\/\//)) {
  localApiProtocol = 'http://'
  localApiHost = `${dockerHost.match(/^tcp:\/\/([\d|.]*):\d*/)[1]}:9080`
} else {
  localApiProtocol = 'http://'
  localApiHost = 'localhost'
}

// TODO set protocol into parameter to serve https or http or ws
const all = {
  api: {
    protocol: localApiProtocol,
    host: localApiHost,
    routes: {
      brick: `${api.brick}`,
      db: `${api.db}`,
      event: `${api.event}`,
      projectConfig: `${api.projectConfig}`,
      project: `${api.project}`,
      user: `${api.user}`,
      version: `${api.version}`
    }
  }
}

export default all
