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

import path from 'path'
import express from 'express'
import proxy from 'http-proxy-middleware'
import webpack from 'webpack'
import webpackConfig from './webpack.config'
import config from './config/config'
import logger from './config/logger'

// express config
const app = express()
global.__baseDirname = __dirname

// Return error if DOCKER_HOST or API_ENV are not set
if (config.api.host) {
  let dockerApiHost
  const dockerHost = process.env.DOCKER_HOST
  if (dockerHost && dockerHost.match(/^tcp:\/\//)) {
    dockerApiHost = `http://${dockerHost.match(/^tcp:\/\/([\d|.]*):\d*/)[1]}:9080`
  } else {
    dockerApiHost = 'http://localhost'
  }

  // if Docker is not used for api, don’t log it
  if (dockerApiHost === `http://${config.api.host}`) {
    logger.info('≈≈≈ 🐳  Docker Api Host', config.api.host)
  }
} else {
  logger.error('DOCKER_HOST or API_ENV are not set')
  config.api.error = true
}

// static content
app.use(express.static('static'))

// webpack config
const compiler = webpack(webpackConfig)
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  chunks: false,
  quiet: false,
  stats: {
    colors: true,
    noInfo: true,
    chunkModules: false,
    assets: false
  },
  publicPath: webpackConfig.output.publicPath
}))
app.use(require('webpack-hot-middleware')(compiler))

// serve index.html for all get to anything but /api
app.get(/^(\/(?!api).*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'))
})

// proxy
app.use('/api/v1/', proxy({
  target: `${config.api.protocol}${config.api.host}`,
  changeOrigin: true,
  headers: {
    host: config.api.host
  },
  logProvider(provider) {
    return {
      debug: logger.debug,
      info: logger.info,
      warn: logger.warn,
      error: logger.error
    }
  },
  logLevel: process.env.LOG_LEVEL_ENV || 'debug',
  onProxyReq(proxyReq, req, res) {
    logger.debug(
      `
        ProxyReq
        method: ${req.method}
        body: ${JSON.stringify(req.body)}
        headers: ${JSON.stringify(req.headers)}
      `
    )
  }
}))

// server config
const port = config.server.port
const host = 'localhost'

if (config.api.error) {
  logger.error('Error: Server can’t be started')
  throw new Error('Server error')
} else {
  app.listen(port, host, (err) => {
    if (err) {
      logger.error(err)
    } else {
      logger.info(`<== 👾  API is routed to ${config.api.protocol}${config.api.host}`)
      logger.info(`==> 🌍  Listening at http://${host}:${port}`)
    }
  })
}

export default app
