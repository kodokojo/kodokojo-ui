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

module.exports = {
  entry: {
    app: [
      'eventsource-polyfill',
      'webpack-hot-middleware/client'
    ]
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'assets/scripts/[name].js',
    publicPath: '/'
  },
  // FIXME due to a webpack bug, source map are broken with recommended devtool
  // devtool: 'cheap-module-eval-source-map',
  devtool: "#inline-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'config')
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'style!css!less'
      },
      {
        test: /(\.scss|\.css)$/,
        loader:
          'style!css?sourceMap&modules&localIdentName=[name]---[local]---[hash:base64:5]&importLoaders=2!resolve-url!sass?sourceMap'
      }
    ]
  }
}
