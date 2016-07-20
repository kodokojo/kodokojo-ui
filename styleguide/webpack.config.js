'use strict'

// imports
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var validate = require('webpack-validator')

// webpack config
var configCommon = require('../webpack.config.common')
var configDev = require('../webpack.config.dev')

var configStyleguide = {
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\.\/header/, 'custom-header')
  ],
  resolve: {
    alias: {
      'custom-header': path.resolve('styleguide/ui/header.js')
    }
  }
}

module.exports = validate(
  merge.smart(
    configCommon,
    configDev,
    configStyleguide
  )
)


