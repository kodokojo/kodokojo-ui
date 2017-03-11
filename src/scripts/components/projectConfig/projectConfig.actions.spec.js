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
import * as actions from './projectConfig.actions'
import { __RewireAPI__ as actionsRewireApi } from './projectConfig.actions'
import {
  PROJECT_CONFIG_REQUEST,
  PROJECT_CONFIG_SUCCESS,
  PROJECT_CONFIG_FAILURE,
  PROJECT_CONFIG_NEW_REQUEST,
  PROJECT_CONFIG_NEW_SUCCESS,
  PROJECT_CONFIG_NEW_FAILURE,
  PROJECT_CONFIG_ADD_USER_REQUEST,
  PROJECT_CONFIG_ADD_USER_SUCCESS,
  PROJECT_CONFIG_ADD_USER_FAILURE
} from '../../commons/constants'

// Apply the middleware to the store
const middlewares = [
  thunk,
  apiMiddleware
]
const mockStore = configureMockStore(middlewares)

describe('project config actions', () => {
  let historyPushSpy
  let getHeadersSpy
  let mapProjectConfigSpy

  beforeEach(() => {
    historyPushSpy = sinon.spy()
    actionsRewireApi.__Rewire__('browserHistory', {
      push: historyPushSpy
    })
    getHeadersSpy = sinon.spy()
    actionsRewireApi.__Rewire__('getHeaders', getHeadersSpy)
    mapProjectConfigSpy = sinon.stub()
    actionsRewireApi.__Rewire__('mapProjectConfig', mapProjectConfigSpy)
  })

  afterEach(() => {
    actionsRewireApi.__ResetDependency__('getHeaders')
    actionsRewireApi.__ResetDependency__('browserHistory')
    actionsRewireApi.__ResetDependency__('mapProjectConfig')
    nock.cleanAll()
  })

  describe('create project config', () => {
    let getProjectConfigSpy
    let createProjectSpy
    let mapProjectConfigOutputSpy

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('getProjectConfig')
      actionsRewireApi.__ResetDependency__('createProject')
      actionsRewireApi.__ResetDependency__('mapProjectConfigOutput')
    })

    // TODO UT add test for users array and stackConfig params
    it('should create project config', () => {
      // Given
      const projectConfig = {
        id: 'projectId',
        name: 'Acme',
        admins: ['idUs3r']
      }
      mapProjectConfigOutputSpy = sinon.stub().returns(projectConfig)
      getProjectConfigSpy = sinon.stub().returns({
        type: 'MOCKED_GET_PROJECT_CONFIG'
      })
      actionsRewireApi.__Rewire__('getProjectConfig', getProjectConfigSpy)
      createProjectSpy = sinon.stub().returns({
        type: 'MOCKED_CREATE_PROJECT'
      })
      actionsRewireApi.__Rewire__('createProject', createProjectSpy)
      const expectedActions = [
        {
          type: PROJECT_CONFIG_NEW_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: PROJECT_CONFIG_NEW_SUCCESS,
          payload: {
            projectConfig: {
              id: projectConfig.id
            }
          },
          meta: undefined
        },
        {
          type: 'MOCKED_GET_PROJECT_CONFIG'
        },
        {
          type: 'MOCKED_CREATE_PROJECT'
        }
      ]
      nock('http://localhost')
        .post(`${api.projectConfig}`)
        .reply(201, () => projectConfig.id)

      // When
      const store = mockStore({
        projectConfig: {
          id: projectConfig.id
        }
      })

      // Then
      return store
        .dispatch(actions.createProjectConfig(projectConfig))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(1)
          expect(mapProjectConfigSpy).to.have.callCount(0)
          expect(getProjectConfigSpy).to.have.callCount(1)
          expect(getProjectConfigSpy).to.have.been.calledWith(projectConfig.id)
          expect(createProjectSpy).to.have.callCount(1)
          expect(createProjectSpy).to.have.been.calledWith(projectConfig.id)
          expect(historyPushSpy).to.have.callCount(1)
          expect(historyPushSpy).to.have.been.calledWith('/stacks')
        })
    })
  })

  // TODO failure UT
  describe('get project config', () => {
    let getUserSpy
    let updateMenuProjectSpy
    let updateBreadcrumbProjectSpy

    beforeEach(() => {
      getUserSpy = sinon.stub().returns({
        type: 'MOCKED_ACTION_USER_GET'
      })
      actionsRewireApi.__Rewire__('getUser', getUserSpy)
      updateMenuProjectSpy = sinon.stub().returns({
        type: 'MOCKED_ACTION_UPDATE_MENU_PROJECT'
      })
      actionsRewireApi.__Rewire__('updateMenuProject', updateMenuProjectSpy)
      updateBreadcrumbProjectSpy = sinon.stub().returns({
        type: 'MOCKED_ACTION_UPDATE_BREADCRUMB_PROJECT'
      })
      actionsRewireApi.__Rewire__('updateBreadcrumbProject', updateBreadcrumbProjectSpy)
    })

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('getUserFromId')
      actionsRewireApi.__ResetDependency__('updateMenuProject')
      actionsRewireApi.__ResetDependency__('updateBreadcrumbProject')
      actionsRewireApi.__ResetDependency__('mapProjectConfig')
    })

    it('should return project config', () => {
      // Given
      const projectConfigName = 'Acme'
      const projectConfigAdmins = [
        'idUs3r'
      ]
      const projectConfigId = 'projectId'
      const projectConfig = {
        id: projectConfigId,
        name: projectConfigName,
        admins: projectConfigAdmins,
        users: [
          'otherUserId'
        ]
      }
      mapProjectConfigSpy = sinon.stub().returns(projectConfig)
      actionsRewireApi.__Rewire__('mapProjectConfig', mapProjectConfigSpy)
      const expectedActions = [
        {
          type: PROJECT_CONFIG_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: PROJECT_CONFIG_SUCCESS,
          payload: {
            projectConfig
          },
          meta: undefined
        },
        {
          type: 'MOCKED_ACTION_USER_GET'
        },
        {
          type: 'MOCKED_ACTION_UPDATE_MENU_PROJECT'
        },
        {
          type: 'MOCKED_ACTION_UPDATE_BREADCRUMB_PROJECT'
        }
      ]
      nock('http://localhost')
        .get(`${api.projectConfig}/${projectConfigId}`)
        .reply(200, () => (
          {
            projectConfig
          }
        ))

      // When
      const store = mockStore({
        projectConfig
      })

      // Then
      return store.dispatch(actions.getProjectConfig(projectConfigId))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(1)
          expect(mapProjectConfigSpy).to.have.callCount(1)
          expect(mapProjectConfigSpy).to.have.been.calledWith({
            projectConfig
          })
          expect(getUserSpy).to.have.callCount(1)
          expect(getUserSpy).to.have.calledWith('otherUserId')
          expect(updateMenuProjectSpy).to.have.callCount(1)
          expect(updateMenuProjectSpy).to.have.calledWith('Acme')
        })
    })
  })

  // TODO failure UT
  describe('add user to project config', () => {
    let createUserSpy
    let getProjectConfigSpy
    let newAlertSpy

    beforeEach(() => {
      createUserSpy = sinon.stub().returns({
        type: 'MOCKED_USER_CREATE',
        payload: {
          account: {
            identifier: 'otherUserId'
          }
        }
      })
      actionsRewireApi.__Rewire__('createUser', createUserSpy)
      getProjectConfigSpy = sinon.stub().returns({
        type: 'MOCKED_PROJECT_GET'
      })
      actionsRewireApi.__Rewire__('getProjectConfig', getProjectConfigSpy)
      newAlertSpy = sinon.stub().returns({
        type: 'MOCKED_ADD_ALERT'
      })
      actionsRewireApi.__Rewire__('newAlert', newAlertSpy)
    })

    afterEach(() => {
      actionsRewireApi.__ResetDependency__('createUser')
      actionsRewireApi.__ResetDependency__('getProjectConfig')
      actionsRewireApi.__ResetDependency__('newAlert')
    })

    it('should return project config', () => {
      // Given
      const projectConfigName = 'Acme'
      const projectConfigAdmins = ['idUs3r']
      const projectConfigId = 'projectId'
      const projectConfig = {
        id: projectConfigId,
        name: projectConfigName,
        admins: projectConfigAdmins,
        users: [
          { id: 'otherUserId' }
        ]
      }
      const userEmail = 'email@test.com'
      const alertAddMember = {
        icon: 'question_answer',
        labelId: 'alert-member-create-text',
        label: 'id',
        timeout: 30000,
        variant: 'info'
      }
      const expectedActions = [
        {
          type: 'MOCKED_USER_CREATE',
          payload: {
            account: {
              identifier: 'otherUserId'
            }
          }
        },
        {
          type: PROJECT_CONFIG_ADD_USER_REQUEST,
          payload: undefined,
          meta: undefined
        },
        {
          type: PROJECT_CONFIG_ADD_USER_SUCCESS,
          payload: undefined,
          meta: undefined
        },
        {
          type: 'MOCKED_ADD_ALERT'
        },
        {
          type: 'MOCKED_PROJECT_GET'
        }
      ]
      nock('http://localhost')
        .put(`${api.projectConfig}/${projectConfigId}${api.projectConfigUser}`)
        .reply(200)

      // When
      const store = mockStore({})

      // Then
      return store.dispatch(actions.addUserToProjectConfig(projectConfigId, userEmail))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
          expect(getHeadersSpy).to.have.callCount(1)
          expect(createUserSpy).to.have.callCount(1)
          expect(createUserSpy).to.have.calledWith(userEmail)
          expect(newAlertSpy).to.have.callCount(1)
          expect(newAlertSpy).to.have.calledWith(alertAddMember)
        })
    })
  })
})
