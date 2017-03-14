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
/* eslint-disable no-return-assign */

import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import eventSourceMiddleware, { eventSourceInit} from './eventSource.middleware'
import api from '../commons/config'
import authService from '../services/auth.service'
import {
  EVENT_REQUEST,
  EVENT_STOP
} from '../commons/constants'

describe('event source middleware', () => {
  let getBasicAuthSpy

  beforeEach(() => {
    getBasicAuthSpy = sinon.stub(authService, 'getBasicAuth', () => 'login:psw')
  })

  afterEach(() => {
    authService.getBasicAuth.restore()
  })

  describe('event source init', () => {
    it('should init event source with localhost and credentials', () => {
      // When
      const eventSourceConfig = eventSourceInit()

      // Then
      expect(eventSourceConfig).to.deep.equal({
        basicAuth: 'login:psw',
        url: `http://login:psw@localhost${api.event}`,
        readyState: undefined
      })
    })
  })

  describe('middleware', () => {
    let getStateSpy
    let createFakeStore
    let dispatchWithStoreOf
    let eventSourceFactorySpy
    let eventSourceInitSpy
    let eventSourceClearSpy
    let eventSourceConfig

    beforeEach(() => {
      createFakeStore = fakeData => (
        {
          getState() {
            getStateSpy = sinon.stub().returns(fakeData)
            return getStateSpy
          }
        }
      )
      dispatchWithStoreOf = (storeData, action) => {
        let dispatched = null
        const dispatch = eventSourceMiddleware(createFakeStore(storeData))(actionAttempt => dispatched = actionAttempt)
        dispatch(action)
        return dispatched
      }

      eventSourceConfig = {
        url: `http://login:psw@localhost${api.event}`
      }
      eventSourceInitSpy = sinon.stub().returns(eventSourceConfig)
      eventSourceMiddleware.__Rewire__('eventSourceInit', eventSourceInitSpy)
      eventSourceClearSpy = sinon.stub().returns(eventSourceConfig)
      eventSourceMiddleware.__Rewire__('eventSourceClear', eventSourceClearSpy)
      eventSourceFactorySpy = sinon.stub().returns({})
      eventSourceMiddleware.__Rewire__('eventSourceFactory', eventSourceFactorySpy)
    })
  
    afterEach(() => {
      eventSourceMiddleware.__ResetDependency__('eventSourceInit')
      eventSourceMiddleware.__ResetDependency__('eventSourceClear')
      eventSourceMiddleware.__ResetDependency__('eventSourceFactory')
    })
  
    it('should pass action if not event type', () => {
      // Given
      const action = {
        type: 'SOMETHING_ELSE'
      }
  
      // When
      const appliMiddleware = dispatchWithStoreOf({}, action)
  
      // Then
      expect(appliMiddleware).to.deep.equal(action)
      expect(eventSourceInitSpy).to.have.callCount(1)
      expect(eventSourceFactorySpy).to.have.callCount(0)
    })

    it('should set new event source', () => {
      // Given
      const action = {
        type: EVENT_REQUEST
      }

      // When
      const appliMiddleware = dispatchWithStoreOf({}, action)

      // Then
      expect(appliMiddleware).to.deep.equal(action)
      expect(eventSourceFactorySpy).to.have.callCount(1)
      expect(eventSourceFactorySpy).to.have.been.calledWith(eventSourceConfig.url)
    })

    it('should stop event source', () => {
      // Given
      const action = {
        type: EVENT_STOP
      }

      // When
      const appliMiddleware = dispatchWithStoreOf({}, action)

      // Then
      expect(appliMiddleware).to.deep.equal(action)
      expect(eventSourceClearSpy).to.have.callCount(1)
    })
  })
})
