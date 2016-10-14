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

import express from 'express'
const router = express.Router() // eslint-disable-line new-cap

import config from '../config/config'
import endpoints from '../config/shared/api.endpoints'
import * as user from './user.server.controller'
import * as project from './project.server.controller'
import * as brick from './brick.server.controller'

router.post(config.api.routes.user, user.initUser)

router.post(`${config.api.routes.user}/:id`, user.postUser)

router.get(`${config.api.routes.user}/`, user.getUserAccount)

router.get(`${config.api.routes.user}/:userId`, user.getUser)

router.patch(`${config.api.routes.user}/:userId`, user.updateUser)

router.post(`${config.api.routes.projectConfig}/`, project.postProjectConfig)

router.put(`${config.api.routes.projectConfig}/:projectConfigId${endpoints.projectConfigUser}`, project.putUserToProjectConfig)

router.delete(`${config.api.routes.projectConfig}/:projectConfigId${endpoints.projectConfigUser}`, project.deleteUserFromProjectConfig)

router.get(`${config.api.routes.projectConfig}/:projectConfigId`, project.getProjectConfig)

router.post(`${config.api.routes.project}/:projectConfigId`, project.postProject)

router.get(`${config.api.routes.project}/:projectId`, project.getProject)

router.get(`${config.api.routes.brick}`, brick.getBricks)

export default (app) => {
  app.use(router)
}
