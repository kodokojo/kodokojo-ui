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

/* eslint-disable */

const fs = require('fs')
const spawn = require('child_process').spawn
const Promise = require('bluebird')

const versionFilePath = `${__dirname}/shared/ui.version.json`

function cleanFile() {
  return new Promise(function (resolve, reject) {
    fs.access(versionFilePath, fs.W_OK, (err) => {
      if (err) {
        resolve('no version file, continue')
      } else {
        fs.writeFile(versionFilePath, 'version file', 'utf8', function(err) {
          if (err) {
            console.log(err)
          }
          resolve(`successfully clean ${versionFilePath}`)
        })
      }
    })
  }) 
}

function getBranch() {
  return new Promise(function (resolve, reject) {
    const gitSha = spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD'])

    gitSha.stdout.on('data', (data) => {
      resolve(`${data}`)
    })
    
  })
}

function getCommit() {
  return new Promise(function (resolve, reject) {
    const gitSha = spawn('git', ['rev-parse', 'HEAD'])

    gitSha.stdout.on('data', (data) => {
      resolve(`${data}`)
    })
    
  })
}

function getVersion() {
  return new Promise(function (resolve, reject) {
    const npmVersion = spawn('npm', ['version', '--json'])

    npmVersion.stdout.on('data', (data) => {
      resolve(`${JSON.parse(data)['kodokojo-ui']}`)
    })
  })
}

function writeFile(version, branch, commit) {
  return new Promise(function (resolve, reject) {
    var wstream = fs.createWriteStream(versionFilePath, { defaultEncoding: 'utf8' })
    wstream.on('finish', function () {
      resolve('version json file has been written')
    })
    wstream.on('error', function (err) {
      reject(err)
    });
    wstream.write(
`{
  "version": "${version.trim()}",
  "branch": "${branch.trim()}",
  "commit": "${commit.trim()}"
}
`
    )
    wstream.end()
  })
}

var version
var branch
var commit

cleanFile()
  .then(function(data) {
    console.log(data)
    return getBranch()
  })
  .then(function(data) {
    branch = data
    return getCommit()
  })
  .then(function(data) {
    commit = data
    return getVersion()
  })
  .then(function(data) {
    version = data
    return writeFile(version, branch, commit)
  })
  .then(function(data) {
    console.log(data)
  })
  .catch(function(err) {
    throw new Error(err)
  })
