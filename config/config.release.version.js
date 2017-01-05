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
const Promise = require('bluebird')

const getVersion = require('./config.utils').getVersion

// update README badge version
const readmeFilePath = path.join(__dirname, '../', 'README.md')

function writeReadme(nextVersion) {
  return new Promise((resolve, reject) => {
    let nextReadme = ''
    const rStream = fs.createReadStream(readmeFilePath)
    rStream.setEncoding('utf8')
    rStream.on('data', function(chunk) {
      let nextChunk = chunk
      const versionBadge = chunk.match(/(\[!\[Kodo Kojo UI version]\(https:\/\/img\.shields\.io\/badge\/version-[0-9]{1}.[0-9]{1,2}.[0-9]{1,3}-orange.svg)/g)
      if (versionBadge) {
        nextChunk = chunk.replace(/\/version-[0-9]{1,2}.[0-9]{1,3}.[0-9]{1,3}-orange.svg/, `/version-${nextVersion}-orange.svg`)
      }
      nextReadme += nextChunk
    })
    rStream.on('end', function() {
      const wStream = fs.createWriteStream(readmeFilePath, { defaultEncoding: 'utf-8'})
      wStream.on('finish', function() {
        resolve('readme file is updated')
      })
      wStream.on('error', function(err) {
        reject(err)
      })
      wStream.write(nextReadme)
      wStream.end()
    })
  })
}

let version

getVersion()
  .then(data => writeReadme(data))
  .then(data => {
    console.log(data)
  })
  .catch(function(err) {
    throw new Error(err)
  })
