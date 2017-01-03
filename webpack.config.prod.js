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

'use strict'

var path = require('path')
var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// FIXME to prevent error, node-sass must be specifically 3.4.2
// see https://github.com/react-toolbox/react-toolbox-example/issues/19

module.exports = {
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'assets/scripts/[name]-[hash].js',
    publicPath: '/'
  },
  plugins: [
    new CompressionPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('assets/styles/app-[hash].css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.BABEL_ENV': '"production"'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/kodokojo-ui-commons)/,
        loaders: ['babel'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'config/shared'),
          path.join(__dirname, 'node_modules/kodokojo-ui-commons')
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules(?!\/kodokojo-ui-commons)/,
        loader: ExtractTextPlugin.extract('css!less')
      },
      {
        test: /(\.scss|\.css)$/,
        loader:
          ExtractTextPlugin.extract('css?modules&localIdentName=[name]---[local]---[hash:base64:5]&importLoaders=2!resolve-url!sass')
      }
    ]
  }
}
