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

/* eslint-disable no-unused-expressions */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-duplicates */

import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import authService from './auth.service'

// dependencies to mock
import storageService from './storage.service'

describe('auth service', () => {
  describe('checkAuth method', () => {
    afterEach(() => {
      authService.isAuth.restore()
    })

    it('should check auth and return true if is authenticated', () => {
      // Given
      const isAuthSpy = sinon.stub(authService, 'isAuth').returns(true)
      const replaceStateSpy = sinon.spy()

      // When
      const returned = authService.checkAuth({}, replaceStateSpy)

      // Then
      expect(returned).to.be.true
      expect(isAuthSpy).to.have.callCount(1)
      expect(replaceStateSpy).to.have.callCount(0)
    })

    it('should check auth, apply callback and return false if is not authenticated', () => {
      // Given
      const isAuthSpy = sinon.stub(authService, 'isAuth').returns(false)
      const replaceStateSpy = sinon.stub()
      const nextState = {
        location: {
          pathname: '/next'
        }
      }

      // When
      const returned = authService.checkAuth(nextState, replaceStateSpy)

      // Then
      expect(returned).to.be.false
      expect(isAuthSpy).to.have.callCount(1)
      expect(replaceStateSpy).to.have.callCount(1)
      expect(replaceStateSpy).to.have.been.calledWith({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    })
  })

  describe('setAuth method', () => {
    afterEach(() => {
      authService.encryptBasicAuth.restore()
    })

    it('should set auth if arguments are passed', () => {
      // Given
      const username = 'username'
      const password = 'password'
      const encryptBasicAuthSpy = sinon.stub(authService, 'encryptBasicAuth').returns('token')

      // When
      const returned = authService.setAuth(username, password)

      // Then
      expect(returned).to.be.equal('token')
      expect(encryptBasicAuthSpy).to.have.callCount(1)
      expect(encryptBasicAuthSpy).to.have.have.been.calledWith(`${username}:${password}`)
    })

    it('should return undefined if no arguments', () => {
      // Given
      const encryptBasicAuthSpy = sinon.stub(authService, 'encryptBasicAuth').returns('token')

      // When
      const returned = authService.setAuth()

      // Then
      expect(returned).to.be.equal('')
      expect(encryptBasicAuthSpy).to.have.callCount(0)
    })
  })

  describe('putAuth method', () => {
    afterEach(() => {
      storageService.put.restore()
    })

    it('should put auth', () => {
      // Given
      const id = 'userId'
      const userName = 'userName'
      const putSpy = sinon.spy(storageService, 'put')

      // When
      authService.putAuth(id, userName)

      // Then
      expect(putSpy).to.have.callCount(3)
      expect(putSpy).to.have.been.calledWithExactly('isAuthenticated', true, 'session')
      expect(putSpy).to.have.been.calledWithExactly('userId', id, 'session')
      expect(putSpy).to.have.been.calledWithExactly('userName', userName, 'session')
    })
  })

  describe('resetAuth method', () => {
    afterEach(() => {
      storageService.remove.restore()
    })

    it('should reset auth', () => {
      // Given
      const removeSpy = sinon.spy(storageService, 'remove')

      // When
      authService.resetAuth()

      // Then
      expect(removeSpy).to.have.callCount(4)
      expect(removeSpy).to.have.been.calledWithExactly('token', 'session')
      expect(removeSpy).to.have.been.calledWithExactly('isAuthenticated', 'session')
      expect(removeSpy).to.have.been.calledWithExactly('userId', 'session')
      expect(removeSpy).to.have.been.calledWithExactly('userName', 'session')
    })
  })

  describe('isAuth method', () => {
    afterEach(() => {
      storageService.get.restore()
    })

    it('should return false if undefined', () => {
      // Given
      const getSpy = sinon.stub(storageService, 'get').returns(undefined)

      // When
      const returned = authService.isAuth()

      // Then
      expect(returned).to.be.false
      expect(getSpy).to.have.callCount(1)
      expect(getSpy).to.have.been.calledWithExactly('isAuthenticated', 'session')
    })

    it('should return false if false', () => {
      // Given
      const getSpy = sinon.stub(storageService, 'get').returns(false)

      // When
      const returned = authService.isAuth()

      // Then
      expect(returned).to.be.false
      expect(getSpy).to.have.callCount(1)
      expect(getSpy).to.have.been.calledWithExactly('isAuthenticated', 'session')
    })

    it('should return true', () => {
      // Given
      const getSpy = sinon.stub(storageService, 'get').returns(true)

      // When
      const returned = authService.isAuth()

      // Then
      expect(returned).to.be.true
      expect(getSpy).to.have.callCount(1)
      expect(getSpy).to.have.been.calledWithExactly('isAuthenticated', 'session')
    })
  })

  describe('getToken method', () => {
    afterEach(() => {
      storageService.get.restore()
    })

    it('should return empty string if undefined', () => {
      // Given
      const getSpy = sinon.stub(storageService, 'get').returns(undefined)

      // When
      const returned = authService.getToken()

      // Then
      expect(returned).to.equal('')
      expect(getSpy).to.have.callCount(1)
      expect(getSpy).to.have.been.calledWithExactly('token', 'session')
    })

    it('should return token', () => {
      // Given
      const getSpy = sinon.stub(storageService, 'get').returns('token')

      // When
      const returned = authService.getToken()

      // Then
      expect(returned).to.equal('token')
      expect(getSpy).to.have.callCount(1)
      expect(getSpy).to.have.been.calledWithExactly('token', 'session')
    })
  })

  describe('getAccount method', () => {
    afterEach(() => {
      storageService.get.restore()
      authService.getToken.restore()
    })

    it('should return token', () => {
      // Given
      const token = 'token'
      const userName = 'userName'
      const userId = 'userId'
      const getSpy = sinon.stub(storageService, 'get')
      getSpy.onCall(0).returns(userId)
      getSpy.onCall(1).returns(userName)
      const getTokenSpy = sinon.stub(authService, 'getToken').returns(token)

      // When
      const returned = authService.getAccount()

      // Then
      expect(returned).to.deep.equal({
        id: userId,
        userName,
        password: token
      })
      expect(getSpy).to.have.callCount(2)
      expect(getSpy).to.have.been.calledWithExactly('userId', 'session')
      expect(getSpy).to.have.been.calledWithExactly('userName', 'session')
      expect(getTokenSpy).to.have.callCount(1)
      expect(getTokenSpy).to.have.been.calledWithExactly()
    })
  })
})
