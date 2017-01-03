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

// dependencies to mock
import authService from '../../services/auth.service'

import authReducer, { authReducerInit } from './auth.reducer'
import { __RewireAPI__ as reducerRewireApi } from './auth.reducer'
import * as ActionsTypes from '../../commons/constants'

describe('auth reducer', () => {
  describe('initialState', () => {
    let authServiceIsAuthSpy
    let authServicegetAccountSpy

    beforeEach(() => {
      authServiceIsAuthSpy = sinon.stub(authService, 'isAuth')
      authServicegetAccountSpy = sinon.stub(authService, 'getAccount')
    })

    afterEach(() => {
      authService.isAuth.restore()
      authService.getAccount.restore()
    })

    it('should return initialState', () => {
      // Given
      const isAuth = undefined
      authServiceIsAuthSpy.returns(isAuth)

      // When
      const initialState = authReducerInit()

      // Then
      expect(initialState).to.deep.equal({
        account: {},
        captcha: {
          value: '',
          reset: false
        },
        isAuthenticated: false,
        isFetching: false
      })
      expect(authServiceIsAuthSpy).to.have.callCount(2)
    })

    it('should return initialState if is authenticated', () => {
      // Given
      const isAuth = true
      const account = 'account'
      authServiceIsAuthSpy.returns(isAuth)
      authServicegetAccountSpy.returns(account)

      // When
      const initialState = authReducerInit()

      // Then
      expect(initialState).to.deep.equal({
        account,
        captcha: {
          value: '',
          reset: false
        },
        isAuthenticated: true,
        isFetching: false
      })
      expect(authServiceIsAuthSpy).to.have.callCount(2)
      expect(authServicegetAccountSpy).to.have.callCount(1)
    })
  })

  describe('reducer', () => {
    let authReducerInitSpy

    beforeEach(() => {
      authReducerInitSpy = sinon.stub()
      authReducerInitSpy.returns({
        account: {},
        captcha: '',
        isFetching: false
      })
      reducerRewireApi.__Rewire__('authReducerInit', authReducerInitSpy)
    })

    afterEach(() => {
      reducerRewireApi.__ResetDependency__('authReducerInit')
    })

    it('should return initialState', () => {
      // Given
      const state = undefined
      const action = {}

      // When
      const nextState = authReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        account: {},
        captcha: '',
        isFetching: false
      })
    })

    it('should handle ACCOUNT_NEW_REQUEST', () => {
      // Given
      const state = {
        account: {
          email: 'email@test.com',
          id: 1
        },
        captcha: ''
      }
      const action = {
        type: ActionsTypes.ACCOUNT_NEW_REQUEST
      }

      // When
      const nextState = authReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        ...state,
        isAuthenticated: false,
        isFetching: true
      })
    })

    it('should handle ACCOUNT_NEW_SUCCESS', () => {
      // Given
      const state = {
        account: {
          email: 'email@test.com',
          id: 1
        },
        captcha: ''
      }
      const action = {
        type: ActionsTypes.ACCOUNT_NEW_SUCCESS,
        payload: {
          account: {
            id: 2,
            name: 'name',
            userName: 'userName',
            email: 'email@test.com',
            password: 'password',
            sshKeyPublic: 'sshPublicKey',
            sshKeyPrivate: 'privateKey'
          }
        }
      }

      // When
      const nextState = authReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        ...state,
        account: action.payload.account,
        isAuthenticated: true,
        isFetching: false
      })
    })

    it('should handle AUTH_REQUEST', () => {
      // Given
      const state = undefined
      const action = {
        type: ActionsTypes.AUTH_REQUEST,
        payload: {
          email: 'email@test.com'
        }
      }

      // When
      const nextState = authReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        account: {},
        captcha: '',
        isAuthenticated: false,
        isFetching: true
      })
    })

    it('should handle AUTH_SUCCESS', () => {
      // Given
      const state = {
        account: {
          email: 'email@test.com',
          id: 1
        },
        captcha: ''
      }
      const action = {
        type: ActionsTypes.AUTH_SUCCESS,
        payload: {
          account: {
            id: 2,
            name: 'name',
            userName: 'userName',
            email: 'email@test.com',
            password: '',
            sshKeyPublic: '',
            sshKeyPrivate: ''
          }
        }
      }

      // When
      const nextState = authReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        ...state,
        account: action.payload.account,
        isAuthenticated: true,
        isFetching: false
      })
    })

    it('should handle AUTH_FAILURE', () => {
      // Given
      const state = undefined
      const action = {
        type: ActionsTypes.AUTH_FAILURE,
        payload: {}
      }

      // When
      const nextState = authReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        account: {},
        captcha: '',
        isAuthenticated: false,
        isFetching: false
      })
    })
  })
})
