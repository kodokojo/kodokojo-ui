'use strict'

// imports
var merge = require('webpack-merge')
var validate = require('webpack-validator')

// webpack configs
var configCommon = require('./webpack.config.common')
var configDev = require('./webpack.config.dev')
var configProd = require('./webpack.config.prod')
var TARGET = process.env.npm_lifecycle_event || process.env.BUILD_ENV

switch (TARGET) {
  default:
  case 'development':
  case 'build:dev':
  case 'start:dev':
    module.exports = validate(merge.smart(configCommon, configDev))
    break
  case 'production':
  case 'build:prod':
  case 'start:prod':
    module.exports = validate(merge.smart(configCommon, configProd))
    break
}
