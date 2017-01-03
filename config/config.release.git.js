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

/* eslint-disable */

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const Promise = require('bluebird')

const getVersion = require('./config.utils').getVersion

const releaseType = process.argv[2]

function addVersionFiles() {
  return new Promise((resolve, reject) => {
    const files = [
      'README.md',
      'package.json',
      'npm-shrinkwrap.json'
    ]
    const gitAdd = spawn('git', ['add'].concat(files))

    gitAdd.stdout.on('data', data => {
      resolve(`${data}`)
    })

    gitAdd.on('close', code => {
      resolve(`process exit with ${code}`)
    })

  })
}

function commitVersionFiles(version) {
  return new Promise((resolve, reject) => {
    const message = `[release] version ${version} (${releaseType})`
    const gitCm = spawn('git', ['commit', '-m', message, '-n'])

    gitCm.stdout.on('data', data => {
      resolve(`${data}`)
    })
  })
}

function tagVersion(version) {
  return new Promise((resolve, reject) => {
    const versionTag = `v${version}`
    const message = `version ${version} (${releaseType})`
    const gitCm = spawn('git', ['tag', '-a', versionTag, '-m', message])

    gitCm.stdout.on('data', data => {
      resolve(`${data}`)
    })
  })
}

let version

getVersion()
  .then(data => {
    version = data
    return addVersionFiles()
  })
  .then(data => {
    console.log(data)
  })
  .then(() => commitVersionFiles(version))
  .then(data => {
    console.log(data)
  })
  .then(() => tagVersion(version))
  .then(data => {
    console.log(data)
  })
  .catch(function(err) {
    throw new Error(err)
  })
