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
