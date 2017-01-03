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

import { expect } from 'chai'
import nock from 'nock'

import { requestWithLog }from './utils.server.service'

describe('test utils promise request', () => {

  it('should return 404 error on GET', () => {
    // Given
    const options = {
      method: 'GET',
      uri: 'http://localhost/404',
      // uri: 'http://httpstat.us/404',
      headers: {},
      json: true,
      rejectUnauthorized: true,
      requestCert: true
    }
    nock('http://localhost')
      .get('/404')
      .reply(404)

    // Then
    return requestWithLog(options)
      .then(() => {
        new Error('should fail')
      })
      .catch(err => {
        expect(err.statusCode).to.equal(404)
      })
  })

  it('should return 401 error on GET', () => {
    // Given
    const options = {
      method: 'GET',
      uri: 'http://localhost/401',
      // uri: 'http://httpstat.us/401',
      headers: {},
      json: true,
      rejectUnauthorized: true,
      requestCert: true
    }
    nock('http://localhost')
      .get('/401')
      .reply(401)

    // Then
    return requestWithLog(options)
      .then(() => {
        new Error('should fail')
      })
      .catch(err => {
        expect(err.statusCode).to.equal(401)
      })
  })

  it('should return 200 on GET', () => {
    // Given
    const options = {
      method: 'GET',
      uri: 'http://localhost/200',
      headers: {},
      json: true,
      rejectUnauthorized: true,
      requestCert: true
    }
    nock('http://localhost')
      .get('/200')
      .reply(200)

    // Then
    return requestWithLog(options)
      .then((res) => {
        expect(res.statusCode).to.equal(200)
      })
      .catch()
  })

  it('should return 200 on POST', () => {
    // Given
    const options = {
      method: 'POST',
      uri: 'http://localhost/200',
      headers: {},
      body: {
        
      },
      json: true,
      rejectUnauthorized: true,
      requestCert: true
    }
    nock('http://localhost')
      .post('/200')
      .reply(200)

    // Then
    return requestWithLog(options)
      .then(res => {
        expect(res.statusCode).to.equal(200)
      })
      .catch()
  })

  it('should return 200 on DELETE', () => {
    // Given
    const options = {
      method: 'DELETE',
      uri: 'http://localhost/200',
      headers: {},
      json: true,
      rejectUnauthorized: true,
      requestCert: true
    }
    nock('http://localhost')
      .delete('/200')
      .reply(200)

    // Then
    return requestWithLog(options)
      .then(res => {
        expect(res.statusCode).to.equal(200)
      })
      .catch()
  })

  it('should return 200 on PATCH', () => {
    // Given
    const options = {
      method: 'PATCH',
      uri: 'http://localhost/200',
      headers: {},
      body: {
        
      },
      json: true,
      rejectUnauthorized: true,
      requestCert: true
    }
    nock('http://localhost')
      .patch('/200')
      .reply(200, {
        success: true
      })

    // Then
    return requestWithLog(options)
      .then(res => {
        expect(res.statusCode).to.equal(200)
      })
      .catch()
  })
})
