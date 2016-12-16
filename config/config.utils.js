const Promise = require('bluebird')
const spawn = require('child_process').spawn

const configUtils = {}

configUtils.getVersion = () => {
  return new Promise((resolve, reject) => {
    const npmVersion = spawn('npm', ['version', '--json'])

    npmVersion.stdout.on('data', (data) => {
      resolve(`${JSON.parse(data)['kodokojo-ui']}`)
    })
  })
}

module.exports = configUtils
