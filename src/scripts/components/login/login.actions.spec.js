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
    let routeToContextSpy

    beforeEach(() => {
      routeToContextSpy = sinon.stub().returns({
        type: 'MOCKED_ROUTE_CONTEXT_EVENT'
      })
      actionsRewireApi.__Rewire__('routeToContext', routeToContextSpy)
    })

    afterEach(() => {
      authService.setAuth.restore()
      authService.putAuth.restore()
      actionsRewireApi.__ResetDependency__('mapAccount')
      actionsRewireApi.__ResetDependency__('getProjectConfigAndProject')
      actionsRewireApi.__ResetDependency__('putAuth')
      actionsRewireApi.__ResetDependency__('requestAuthentication')
      actionsRewireApi.__ResetDependency__('routeToContext')
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
      const requestAuthenticationSpy = sinon.stub().returns({
        type: 'MOCKED_AUTH_REQUEST',
        payload: {
          account
        }
      })
      actionsRewireApi.__Rewire__('requestAuthentication', requestAuthenticationSpy)
      const expectedActions = [
        {
          type: 'MOCKED_AUTH_REQUEST',
          payload: {
            account
          }
        },
        {
          type: 'MOCKED_ROUTE_CONTEXT_EVENT'
        }
      ]
      const setAuthSpy = sinon.stub(authService, 'setAuth').returns(auth)
      const putAuthSpy = sinon.spy(authService, 'putAuth')
      mapAccountSpy = sinon.stub().returns(account)
      actionsRewireApi.__Rewire__('mapAccount', mapAccountSpy)
      nock('http://localhost', {
        reqheaders: {
          Authorization: `Basic ${auth}`
        }
      }).get(`${api.user}`)
        .reply(200, () => account)

      // When
      const store = mockStore({
        context: {
          projectConfig: {
            id: 'projectConfigId'
          },
          project: {
            id: 'projectId'
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
        expect(routeToContextSpy).to.have.callCount(1)
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
      const expectedActions = [
        {
          type: 'MOCKED_AUTH_REQUEST',
          payload: {
            account
          }
        },
        {
          type: 'MOCKED_ROUTE_CONTEXT_EVENT'
        }
      ]

      // When
      const store = mockStore({
        context: {
          projectConfig: {
            id: undefined
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
        expect(requestAuthenticationSpy).to.have.callCount(1)
        expect(routeToContextSpy).to.have.callCount(1)
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
      const expectedActions = [
        {
          type: 'MOCKED_AUTH_REQUEST',
          payload: {
            account
          }
        },
        {
          type: 'MOCKED_ROUTE_CONTEXT_EVENT'
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
        expect(requestAuthenticationSpy).to.have.callCount(1)
        expect(routeToContextSpy).to.have.callCount(1)
      })
    })

    /// TODO move this test in auth.action.spec.js
    it.skip('should fail to request auth', () => {
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
          expect(routeToContextSpy).to.have.callCount(0)
        })
    })
  })

  describe('logout', () => {
    let eventStopSpy

    beforeEach(() => {
      eventStopSpy = sinon.stub().returns({
        type: 'MOCKED_EVENT_STOP'
      })
      actionsRewireApi.__Rewire__('eventStop', eventStopSpy)
    })

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('eventStop')
    })

    it('should reset auth', () => {
      // Given
      const expectedActions = [
        {
          type: AUTH_RESET
        },
        {
          type: 'MOCKED_EVENT_STOP'
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
          expect(eventStopSpy).to.have.callCount(1)
          expect(historyPushSpy).to.have.callCount(1)
          expect(historyPushSpy).to.have.been.calledWith('/login')
        })
    })
  })
})
