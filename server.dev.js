import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import webpackConfig from './webpack.config'
import config from './config/config'
import logger from './config/logger'

import apiRoutes from './api/api.server.routes'

// express config
const app = express()
global.__baseDirname = __dirname

// Return error if DOCKER_HOST isn’t set
if (config.api.host) {
  logger.info('Docker host', config.api.host)
} else {
  logger.error('DOCKER_HOST isn’t set')
  config.api.error = true
}

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

// routes
apiRoutes(app)

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

// static content
app.use(express.static('static'))

// serve index.html for all get to anything but /api
app.get(/^(\/(?!api).*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'))
})

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
      logger.info(`==> 🌍  Listening at http://${host}:${port}`)
    }
  })
}

export default app