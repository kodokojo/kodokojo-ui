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

'use strict'

// imports
var merge = require('webpack-merge')
var validate = require('webpack-validator')

// webpack configs
var configCommon = require('./webpack.config.common')
var configDev = require('./webpack.config.dev')
var configProd = require('./webpack.config.prod')
var TARGET = process.env.npm_lifecycle_event || process.env.NODE_ENV

switch (TARGET) {
  default:
  case 'development':
  case 'custom':
  case 'mock':
  case 'build:dev':
  case 'start:dev':
  case 'build:custom':
  case 'start:custom':
  case 'build:mock':
  case 'start:mock':
    module.exports = validate(merge.smart(configCommon, configDev))
    break
  case 'production':
  case 'local':
  case 'build:local':
  case 'start:local':
  case 'build:prod':
  case 'start:prod':
    module.exports = validate(merge.smart(configCommon, configProd))
    break
}
