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
import storageService from '../../services/storage.service'

import projectConfigReducer, { projectConfigReducerInit } from './projectConfig.reducer'
import { __RewireAPI__ as reducerRewireApi } from './projectConfig.reducer'
import {
  PROJECT_CONFIG_NEW_REQUEST,
  PROJECT_CONFIG_NEW_SUCCESS,
  PROJECT_CONFIG_NEW_FAILURE
} from '../../commons/constants'

// TODO refactor tests to match projectConfig reducer changes
describe.skip('projectConfig reducer', () => {
  describe('initialState', () => {
    let storageServiceGetSpy

    beforeEach(() => {
      storageServiceGetSpy = sinon.stub(storageService, 'get')
    })

    afterEach(() => {
      storageService.get.restore()
    })

    it('should return initialState', () => {
      // Given
      const projectCondifgId = undefined
      const projectId = undefined
      storageServiceGetSpy.onCall(0).returns(projectCondifgId)
      storageServiceGetSpy.onCall(1).returns(projectId)

      // When
      const initialState = projectConfigReducerInit()

      // Then
      expect(initialState).to.deep.equal({
        id: projectCondifgId,
        isFetching: false
      })
      expect(storageServiceGetSpy).to.have.callCount(2)
      expect(storageServiceGetSpy).to.have.been.calledWith('projectConfigId')
      expect(storageServiceGetSpy).to.have.been.calledWith('projectId')
    })

    it('should return initialState with projectConfig id', () => {
      // Given
      const projectCondifgId = 'projectConfigId1'
      const projectId = undefined
      storageServiceGetSpy.onCall(0).returns(projectCondifgId)
      storageServiceGetSpy.onCall(1).returns(projectId)

      // When
      const initialState = projectConfigReducerInit()

      // Then
      expect(initialState).to.deep.equal({
        id: projectCondifgId,
        isFetching: false
      })
      expect(storageServiceGetSpy).to.have.callCount(2)
      expect(storageServiceGetSpy).to.have.been.calledWith('projectConfigId')
      expect(storageServiceGetSpy).to.have.been.calledWith('projectId')
    })

    it('should return initialState with projectConfig and project id', () => {
      // Given
      const projectCondifgId = 'projectConfigId1'
      const projectId = 'projectId1'
      storageServiceGetSpy.onCall(0).returns(projectCondifgId)
      storageServiceGetSpy.onCall(1).returns(projectId)

      // When
      const initialState = projectConfigReducerInit()

      // Then
      expect(initialState).to.deep.equal({
        id: projectCondifgId,
        project: {
          id: projectId
        },
        isFetching: false
      })
      expect(storageServiceGetSpy).to.have.callCount(2)
      expect(storageServiceGetSpy).to.have.been.calledWith('projectConfigId')
      expect(storageServiceGetSpy).to.have.been.calledWith('projectId')
    })
  })

  describe('reducer', () => {
    let projectConfigReducerInitSpy

    beforeEach(() => {
      projectConfigReducerInitSpy = sinon.stub()
      projectConfigReducerInitSpy.returns({
        isFetching: false
      })
      reducerRewireApi.__Rewire__('projectConfigReducerInit', projectConfigReducerInitSpy)
    })

    afterEach(() => {
      reducerRewireApi.__ResetDependency__('projectConfigReducerInit')
    })

    it('should return initialState', () => {
      // Given
      const state = undefined
      const action = {}

      // When
      const nextState = projectConfigReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        isFetching: false
      })
      expect(projectConfigReducerInitSpy).to.have.callCount(1)
    })

    it('should handle PROJECT_CONFIG_NEW_REQUEST', () => {
      // Given
      const state = undefined
      const action = {
        type: PROJECT_CONFIG_NEW_REQUEST
      }

      // When
      const nextState = projectConfigReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        isFetching: true
      })
    })

    it('should handle PROJECT_CONFIG_NEW_SUCCESS', () => {
      // Given
      const state = undefined
      const action = {
        type: PROJECT_CONFIG_NEW_SUCCESS,
        payload: {
          projectConfig: {
            id: 'projectId'
          }
        }
      }

      // When
      const nextState = projectConfigReducer(state, action)

      // Then
      expect(nextState).to.deep.equal({
        id: 'projectId',
        isFetching: false
      })
    })
  })
})
