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
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import configureMockStore from 'redux-mock-store'

// dependencies to mock
import api from '../../commons/config'
import * as actions from './signup.actions'
import { __RewireAPI__ as actionsRewireApi } from './signup.actions'
import {
  ACCOUNT_NEW_REQUEST,
  ACCOUNT_NEW_SUCCESS,
  ACCOUNT_NEW_ACCEPTED,
  ACCOUNT_NEW_FAILURE
} from '../../commons/constants'

// Apply the middleware to the store
const middlewares = [
  thunk,
  apiMiddleware
]
const mockStore = configureMockStore(middlewares)

describe('signup actions', () => {
  describe('create auth', () => {
    let pushHistorySpy
    let setAuthSpy
    let putAuthSpy
    let requestWebsocketSpy
    let createUserSpy
    let account

    beforeEach(() => {
      account = {
        id: 2,
        name: 'name',
        userName: 'userName',
        email: 'email@test.com',
        password: 'password',
        sshKeyPublic: 'sshPublicKey',
        sshKeyPrivate: 'privateKey'
      }
      pushHistorySpy = sinon.spy()
      actionsRewireApi.__Rewire__('browserHistory', {
        push: pushHistorySpy
      })
      setAuthSpy = sinon.spy()
      actionsRewireApi.__Rewire__('setAuth', setAuthSpy)
      putAuthSpy = sinon.spy()
      actionsRewireApi.__Rewire__('putAuth', putAuthSpy)
      requestWebsocketSpy = sinon.stub().returns({
        type: 'MOCKED_WEBSOCKET_REQUEST'
      })
      actionsRewireApi.__Rewire__('requestWebsocket', requestWebsocketSpy)
    })

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('browserHistory')
      actionsRewireApi.__ResetDependency__('setAuth')
      actionsRewireApi.__ResetDependency__('putAuth')
      actionsRewireApi.__ResetDependency__('requestWebsocket')
      actionsRewireApi.__ResetDependency__('createUser')
    })

    it('should create auth navigate to firstProject page', () => {
      // Given
      createUserSpy = sinon.stub().returns({
        type: 'MOCKED_CREATE_USER',
        payload: {
          account,
          status: 201
        }
      })
      actionsRewireApi.__Rewire__('createUser', createUserSpy)
      const expectedActions = [
        {
          type: ACCOUNT_NEW_REQUEST
        },
        {
          type: 'MOCKED_CREATE_USER',
          payload: {
            account,
            status: 201
          }
        },
        {
          type: ACCOUNT_NEW_SUCCESS,
          payload: {
            account,
            status: 201
          }
        },
        {
          type: 'MOCKED_WEBSOCKET_REQUEST'
        }
      ]

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.createAccount(account.email))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(createUserSpy).to.have.callCount(1)
          expect(createUserSpy).to.have.been.calledWith(account.email)
          expect(pushHistorySpy).to.have.callCount(1)
          expect(pushHistorySpy).to.have.been.calledWith('/firstProject')
          expect(setAuthSpy).to.have.callCount(1)
          expect(setAuthSpy).to.have.been.calledWith(account.userName, account.password)
          expect(putAuthSpy).to.have.callCount(1)
          expect(putAuthSpy).to.have.been.calledWith(account.id)
          expect(requestWebsocketSpy).to.have.callCount(1)
        })
    })

    it('should not create auth, accept account and return 202', () => {
      // Given
      createUserSpy = sinon.stub().returns({
        type: 'MOCKED_CREATE_USER',
        payload: {
          status: 202
        }
      })
      actionsRewireApi.__Rewire__('createUser', createUserSpy)
      const expectedActions = [
        {
          type: ACCOUNT_NEW_REQUEST
        },
        {
          type: 'MOCKED_CREATE_USER',
          payload: {
            status: 202
          }
        },
        {
          type: ACCOUNT_NEW_ACCEPTED,
          payload: {
            status: 202
          }
        }
      ]

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.createAccount(account.email))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(createUserSpy).to.have.callCount(1)
          expect(createUserSpy).to.have.been.calledWith(account.email)
          expect(pushHistorySpy).to.have.callCount(0)
          expect(setAuthSpy).to.have.callCount(0)
          expect(putAuthSpy).to.have.callCount(0)
          expect(requestWebsocketSpy).to.have.callCount(0)
        })
    })

    it('should fail to create auth', () => {
      // Given
      const error = {
        status: {
          message: '500'
        }
      }
      createUserSpy = sinon.stub().returns({
        type: 'MOCKED_CREATE_USER',
        error: true,
        payload: error
      })
      actionsRewireApi.__Rewire__('createUser', createUserSpy)
      const expectedActions = [
        {
          type: ACCOUNT_NEW_REQUEST
        },
        {
          type: 'MOCKED_CREATE_USER',
          error: true,
          payload: error
        },
        {
          type: ACCOUNT_NEW_FAILURE,
          payload: error
        }
      ]

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.createAccount(account.email))
        .then(() => {
          new Error('This fail case test passed')
        })
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(createUserSpy).to.have.callCount(1)
          expect(createUserSpy).to.have.been.calledWith(account.email)
          expect(pushHistorySpy).to.have.callCount(0)
          expect(setAuthSpy).to.have.callCount(0)
          expect(putAuthSpy).to.have.callCount(0)
          expect(requestWebsocketSpy).to.have.callCount(0)
        })
    })
  })
})
