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
import nock from 'nock'
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import configureMockStore from 'redux-mock-store'
import Promise from 'bluebird'

import api from '../../commons/config'
import * as actions from './login.actions'
import { __RewireAPI__ as actionsRewireApi } from './login.actions'
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE, AUTH_RESET } from '../../commons/constants'

// dependencies to mock
import authService from '../../services/auth.service'
import ioService from '../../services/io.service'

// Apply the middleware to the store
const middlewares = [
  thunk,
  apiMiddleware
]
const mockStore = configureMockStore(middlewares)

describe('login actions', () => {
  let historyPushSpy
  beforeEach(() => {
    historyPushSpy = sinon.spy()
    actionsRewireApi.__Rewire__('browserHistory', {
      push: historyPushSpy
    })
  })

  afterEach(() => {
    nock.cleanAll()
    actionsRewireApi.__ResetDependency__('browserHistory')
  })

  describe('login', () => {
    let mapAccountSpy
    let getProjectConfigAndProjectSpy
    let requestWebsocketSpy

    beforeEach(() => {
      getProjectConfigAndProjectSpy = sinon.stub().returns({
        type: 'MOCKED_GET_PROJECTCONFIG_PROJECT'
      })
      actionsRewireApi.__Rewire__('getProjectConfigAndProject', getProjectConfigAndProjectSpy)
      requestWebsocketSpy = sinon.stub().returns({
        type: 'MOCKED_WEBSOCKET_REQUEST'
      })
      actionsRewireApi.__Rewire__('requestWebsocket', requestWebsocketSpy)
    })

    afterEach(() => {
      authService.setAuth.restore()
      authService.putAuth.restore()
      ioService.getHeaders.restore()
      actionsRewireApi.__ResetDependency__('mapAccount')
      actionsRewireApi.__ResetDependency__('getProjectConfigAndProject')
      actionsRewireApi.__ResetDependency__('putAuth')
      actionsRewireApi.__ResetDependency__('requestAuthentication')
      actionsRewireApi.__ResetDependency__('requestWebsocket')
    })

    it('should request auth', () => {
      // Given
      const username = 'test'
      const password = 'psUs3r'
      const auth = 'cryptedAuth'
      const account = {
        id: 'idUs3r',
        projectConfigIds: [
          {
            projectConfigId: 'projectConfigId',
            projectId: 'projectId'
          }
        ]
      }
      const expectedActions = [
        {
          type: AUTH_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: AUTH_SUCCESS,
          payload: {
            account
          },
          meta: undefined
        },
        {
          type: 'MOCKED_GET_PROJECTCONFIG_PROJECT'
        },
        {
          type: 'MOCKED_WEBSOCKET_REQUEST'
        }
      ]
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      }
      const setAuthSpy = sinon.stub(authService, 'setAuth').returns(auth)
      const putAuthSpy = sinon.spy(authService, 'putAuth')
      const getHeadersSpy = sinon.stub(ioService, 'getHeaders').returns(headers)
      mapAccountSpy = sinon.stub().returns(account)
      actionsRewireApi.__Rewire__('mapAccount', mapAccountSpy)
      nock('http://localhost', {
        reqheaders: {
          Authorization: `Basic ${auth}`
        }
      }).get(`${api.user}`)
        .reply(200, () => account)


      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.login(username, password)).then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        expect(setAuthSpy).to.have.callCount(1)
        expect(setAuthSpy).to.have.been.calledWith(username, password)
        expect(putAuthSpy).to.have.callCount(1)
        expect(putAuthSpy).to.have.been.calledWith(account)
        expect(getHeadersSpy).to.have.callCount(1)
        expect(getProjectConfigAndProjectSpy).to.have.callCount(1)
        expect(historyPushSpy).to.have.callCount(1)
        expect(historyPushSpy).to.have.been.calledWith('/stacks')
        expect(requestWebsocketSpy).to.have.callCount(1)
      })
    })

    it('should redirect to first project', () => {
      // Given
      const username = 'test'
      const password = 'psUs3r'
      const auth = 'cryptedAuth'
      const account = {
        id: 'idUs3r',
        projectConfigIds: []
      }
      const requestAuthenticationSpy = sinon.stub().returns({
        type: 'MOCKED_AUTH_REQUEST',
        payload: {
          account
        }
      })
      actionsRewireApi.__Rewire__('requestAuthentication', requestAuthenticationSpy)
      const setAuthSpy = sinon.stub(authService, 'setAuth').returns(auth)
      const putAuthSpy = sinon.spy(authService, 'putAuth')
      const getHeadersSpy = sinon.spy(ioService, 'getHeaders')
      const expectedActions = [
        {
          type: 'MOCKED_AUTH_REQUEST',
          payload: {
            account
          }
        },
        {
          type: 'MOCKED_WEBSOCKET_REQUEST'
        }
      ]

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.login(username, password)).then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        expect(setAuthSpy).to.have.callCount(1)
        expect(setAuthSpy).to.have.been.calledWith(username, password)
        expect(putAuthSpy).to.have.callCount(1)
        expect(putAuthSpy).to.have.been.calledWith(account)
        expect(getHeadersSpy).to.have.not.been.called
        expect(requestAuthenticationSpy).to.have.callCount(1)
        expect(historyPushSpy).to.have.callCount(1)
        expect(historyPushSpy).to.have.been.calledWith('/firstProject')
        expect(requestWebsocketSpy).to.have.callCount(1)
      })
    })

    it('should redirect to origin location', () => {
      // Given
      const username = 'test'
      const password = 'psUs3r'
      const auth = 'cryptedAuth'
      const account = {
        id: 'idUs3r',
        projectConfigIds: []
      }
      const requestAuthenticationSpy = sinon.stub().returns({
        type: 'MOCKED_AUTH_REQUEST',
        payload: {
          account
        }
      })
      actionsRewireApi.__Rewire__('requestAuthentication', requestAuthenticationSpy)
      const setAuthSpy = sinon.stub(authService, 'setAuth').returns(auth)
      const putAuthSpy = sinon.spy(authService, 'putAuth')
      const getHeadersSpy = sinon.spy(ioService, 'getHeaders')
      const expectedActions = [
        {
          type: 'MOCKED_AUTH_REQUEST',
          payload: {
            account
          }
        },
        {
          type: 'MOCKED_WEBSOCKET_REQUEST'
        }
      ]

      // When
      const store = mockStore({
        routing: {
          locationBeforeTransitions: {
            state: {
              nextPathname: '/someprotectedurl'
            }
          }
        }
      })

      // Then
      return store.dispatch(actions.login(username, password)).then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
        expect(setAuthSpy).to.have.callCount(1)
        expect(setAuthSpy).to.have.been.calledWith(username, password)
        expect(putAuthSpy).to.have.callCount(1)
        expect(putAuthSpy).to.have.been.calledWith(account)
        expect(getHeadersSpy).to.have.not.been.called
        expect(requestAuthenticationSpy).to.have.callCount(1)
        expect(getProjectConfigAndProjectSpy).to.have.callCount(0)
        expect(historyPushSpy).to.have.callCount(1)
        expect(historyPushSpy).to.have.been.calledWith('/someprotectedurl')
        expect(requestWebsocketSpy).to.have.callCount(1)
      })
    })

    it('should fail to request auth', () => {
      // Given
      const username = 'test'
      const password = 'psUs3r'
      const auth = 'cryptedAuth'
      const expectedActions = [
        {
          type: AUTH_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: AUTH_FAILURE,
          error: true,
          payload: {
            message: '401 - Unauthorized',
            name: 'ApiError',
            response: undefined,
            status: 401,
            statusText: 'Unauthorized'
          },
          meta: undefined
        }
      ]
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      }
      const setAuthSpy = sinon.stub(authService, 'setAuth').returns(auth)
      const putAuthSpy = sinon.spy(authService, 'putAuth')
      const getHeadersSpy = sinon.stub(ioService, 'getHeaders').returns(headers)
      nock('http://localhost', {
        reqheaders: {
          Authorization: `Basic ${auth}`
        }
      }).get(`${api.user}`)
        .reply(401)

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.login(username, password))
        .then(() => {
          new Error('This fail case test passed')
        })
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(setAuthSpy).to.have.callCount(1)
          expect(setAuthSpy).to.have.been.calledWith(username, password)
          expect(putAuthSpy).to.have.callCount(0)
          expect(getHeadersSpy).to.have.callCount(1)
          expect(requestWebsocketSpy).to.have.callCount(0)
        })
    })
  })

  describe('logout', () => {
    let stopWebsocketSpy

    beforeEach(() => {
      stopWebsocketSpy = sinon.stub().returns({
        type: 'MOCKED_WEBSOCKET_STOP'
      })
      actionsRewireApi.__Rewire__('stopWebsocket', stopWebsocketSpy)
    })

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('stopWebsocket')
    })

    it('should reset auth', () => {
      // Given
      const expectedActions = [
        {
          type: AUTH_RESET
        },
        {
          type: 'MOCKED_WEBSOCKET_STOP'
        }
      ]
      const resetAuthSpy = sinon.spy(authService, 'resetAuth')

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.logout())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(resetAuthSpy).to.have.callCount(1)
          expect(stopWebsocketSpy).to.have.callCount(1)
          expect(historyPushSpy).to.have.callCount(1)
          expect(historyPushSpy).to.have.been.calledWith('/login')
        })
    })
  })
})
