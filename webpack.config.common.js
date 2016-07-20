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
    ]
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
        test: /\.jpg|png|svg|gif$/,
        loader: 'file-loader?name=assets/images/[name].[ext]'
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=./[name].[ext]'
      }
    ]
  }
}
