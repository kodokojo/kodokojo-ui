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

import api from '../../commons/config'
import * as actions from './user.actions'
import { __RewireAPI__ as actionsRewireApi } from './user.actions'
import {
  USER_NEW_ID_REQUEST,
  USER_NEW_ID_SUCCESS,
  USER_NEW_ID_FAILURE,
  USER_NEW_REQUEST,
  USER_NEW_SUCCESS,
  USER_NEW_FAILURE,
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE
} from '../../commons/constants'

// Apply the middleware to the store
const middlewares = [
  thunk,
  apiMiddleware
]
const mockStore = configureMockStore(middlewares)

describe('user actions', () => {
  let getHeadersSpy

  beforeEach(() => {
    getHeadersSpy = sinon.spy()
    actionsRewireApi.__Rewire__('getHeaders', getHeadersSpy)
  })

  afterEach(() => {
    actionsRewireApi.__ResetDependency__('getHeaders')
    nock.cleanAll()
  })

  describe('create user', () => {
    let mapAccountSpy

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('mapAccount')
    })

    it('should create user', () => {
      // Given
      const email = 'test@email.com'
      const id = 'idUs3r'
      const account = {
        id,
        userName: 'test',
        password: 'password'
      }
      const status = 201
      const expectedActions = [
        {
          type: USER_NEW_ID_REQUEST,
          payload: {
            email
          },
          meta: undefined
        },
        {
          type: USER_NEW_ID_SUCCESS,
          payload: {
            account: {
              id
            }
          },
          meta: undefined
        },
        {
          type: USER_NEW_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: USER_NEW_SUCCESS,
          payload: {
            account,
            status
          },
          meta: undefined
        }
      ]
      nock('http://localhost')
        .post(`${api.user}`)
        .reply(201, () => id)
        .post(`${api.user}/${id}`)
        .reply(201, {
          account,
          status
        })

      mapAccountSpy = sinon.stub().returns(account)
      actionsRewireApi.__Rewire__('mapAccount', mapAccountSpy)

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.createUser(email, 'captcha'))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(2)
          expect(mapAccountSpy).to.have.callCount(1)
        })
    })

    it('should add user to waiting list', () => {
      // Given
      const email = 'test@email.com'
      const id = 'idUs3r'
      const status = 202
      const expectedActions = [
        {
          type: USER_NEW_ID_REQUEST,
          payload: {
            email
          },
          meta: undefined
        },
        {
          type: USER_NEW_ID_SUCCESS,
          payload: {
            account: {
              id
            }
          },
          meta: undefined
        },
        {
          type: USER_NEW_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: USER_NEW_SUCCESS,
          payload: {
            status: 202
          },
          meta: undefined
        }
      ]
      nock('http://localhost')
        .post(`${api.user}`)
        .reply(201, () => id)
        .post(`${api.user}/${id}`)
        .reply(202, {
          status
        })

      mapAccountSpy = sinon.spy()
      actionsRewireApi.__Rewire__('mapAccount', mapAccountSpy)

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.createUser(email))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(2)
          expect(mapAccountSpy).to.have.callCount(0)
        })
    })

    it('should fail to create user id', () => {
      // Given
      const email = 'test@email.com'
      const expectedActions = [
        {
          type: USER_NEW_ID_REQUEST,
          payload: {
            email
          },
          meta: undefined
        },
        {
          type: USER_NEW_ID_FAILURE,
          error: true,
          payload: {
            message: '500 - Internal Server Error',
            name: 'ApiError',
            response: {
              error: 'error'
            },
            status: 500,
            statusText: 'Internal Server Error'
          },
          meta: undefined
        }
      ]
      nock('http://localhost')
        .post(`${api.user}`)
        .reply(500, {
          error: 'error'
        })

      // When
      const store = mockStore({
        account: {
          id: ''
        }
      })

      // Then
      return store.dispatch(actions.createUser(email))
        .then(() => {
          new Error('This fail case test passed')
        })
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(1)
        })
    })

    it('should fail to create user', () => {
      // Given
      const email = 'test@email.com'
      const id = 'idUs3r'
      const expectedActions = [
        {
          type: USER_NEW_ID_REQUEST,
          payload: {
            email
          },
          meta: undefined
        },
        {
          type: USER_NEW_ID_SUCCESS,
          payload: {
            account: {
              id
            }
          },
          meta: undefined
        },
        {
          type: USER_NEW_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: USER_NEW_FAILURE,
          error: true,
          payload: {
            message: '500 - Internal Server Error',
            name: 'ApiError',
            response: {
              error: 'error'
            },
            status: 500,
            statusText: 'Internal Server Error'
          },
          meta: undefined
        }
      ]
      nock('http://localhost')
        .post(`${api.user}`)
        .reply(200, () => id)
        .post(`${api.user}/${id}`)
        .reply(500, {
          error: 'error'
        })


      // When
      const store = mockStore({
        account: {
          id: ''
        }
      })

      // Then
      return store.dispatch(actions.createUser(email))
        .then(() => {
          new Error('This fail case test passed')
        })
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(2)
        })
    })
  })
  describe('get user', () => {
    let mapUserSpy

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('mapUser')
    })

    it('should get user', () => {
      // Given
      const user = {
        id: 'idus3r',
        username: 'test',
        password: 'password',
        firstname: 'firstname',
        lastname: 'lastname',
        name: 'name',
        email: 'test@email.com'
      }
      const expectedActions = [
        {
          type: USER_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: USER_SUCCESS,
          payload: {
            user
          },
          meta: undefined
        }
      ]
      nock('http://localhost')
        .get(`${api.user}/${user.id}`)
        .reply(200, () => user)

      mapUserSpy = sinon.stub().returns(user)
      actionsRewireApi.__Rewire__('mapUser', mapUserSpy)

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.getUser(user.id))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(1)
        })
    })

    it('should fail to get user', () => {
      // Given
      const userId = 'idUs3r'
      const expectedActions = [
        {
          type: USER_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: USER_FAILURE,
          error: true,
          payload: {
            message: '500 - Internal Server Error',
            name: 'ApiError',
            response: {
              error: 'error'
            },
            status: 500,
            statusText: 'Internal Server Error'
          },
          meta: undefined
        }
      ]
      nock('http://localhost')
        .get(`${api.user}/${userId}`)
        .reply(500, {
          error: 'error'
        })

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.getUser(userId))
        .then(() => {
          new Error('This fail case test passed')
        })
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(1)
        })
    })
  })
})
