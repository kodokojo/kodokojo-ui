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
var AssetsPlugin = require('assets-webpack-plugin')

module.exports = {
  entry: {
    app: [
      './src/scripts/app.js'
    ],
    vendors: [ 
      './src/scripts/vendors.js' 
    ]
  },
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ],
    // FIXME there a bug in redux-api-middleware, this is a workaround
    // see https://github.com/agraboso/redux-api-middleware/issues/83
    alias: {
      'redux-api-middleware': path.resolve(__dirname, './node_modules/@aftonbladet/redux-api-middleware/lib/index.js')
    }
  },
  plugins: [
    new AssetsPlugin()
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /styleguide/],
        loaders: ['eslint'],
        include: [
          path.join(__dirname, 'api'),
          path.join(__dirname, 'config'),
          path.join(__dirname, 'src')
        ]
      }
    ],
    loaders: [
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'file-loader?name=assets/images/[name].[ext]'
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=./[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
