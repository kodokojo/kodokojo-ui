'use strict'

var path = require('path')
var webpack = require('webpack')

// FIXME to prevent error, node-sass must be specifically 3.4.2
// see https://github.com/react-toolbox/react-toolbox-example/issues/19

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
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.NormalModuleReplacementPlugin(/^\.\/header/, 'custom-header')
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
