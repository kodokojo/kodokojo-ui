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
      'process.env.BABEL_ENV': '"production"',
      'process.env.BUILD_ENV': '"production"'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'config/shared')
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
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
