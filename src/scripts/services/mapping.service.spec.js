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

import mappingService from './mapping.service'

describe('mapping service', () => {
  describe('map account', () => {
    afterEach(() => {
      mappingService.mapProjectConfigId.restore()
    })

    it('should map account', () => {
      // Given
      const accountFromApi = {
        identifier: 'identifier',
        name: 'name',
        username: 'username',
        email: 'email',
        password: 'password',
        sshPublicKey: 'sshPublicKey',
        privateKey: 'privateKey',
        entityIdentifier: 'entityIdentifier',
        projectConfigurationIds: [
          'projectConfig1',
          'projectConfig2'
        ]
      }
      const mapProjectConfigIdSpy = sinon.stub(mappingService, 'mapProjectConfigId', data => data)

      // When
      const returns = mappingService.mapAccount(accountFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'identifier',
        name: 'name',
        userName: 'username',
        email: 'email',
        password: 'password',
        sshKeyPublic: 'sshPublicKey',
        sshKeyPrivate: 'privateKey',
        entityId: 'entityIdentifier',
        projectConfigIds: [
          'projectConfig1',
          'projectConfig2'
        ]
      })
      expect(mapProjectConfigIdSpy).to.have.callCount(2)
      expect(mapProjectConfigIdSpy).to.have.been.calledWith('projectConfig1')
      expect(mapProjectConfigIdSpy).to.have.been.calledWith('projectConfig2')
    })
  })

  describe('map project config id', () => {
    it('should map project config id', () => {
      // Given
      const projectConfigIdFromApi = {
        projectConfigurationId: 'projectConfigId',
        projectId: 'projectId'
      }

      // When
      const returns = mappingService.mapProjectConfigId(projectConfigIdFromApi)

      // Then
      expect(returns).to.deep.equal({
        projectConfigId: 'projectConfigId',
        projectId: 'projectId'
      })
    })
  })

  describe('map user', () => {
    it('should map user', () => {
      // Given
      const userFromApi = {
        identifier: 'id',
        firstName: 'firstName',
        lastName: 'lastName',
        name: 'name',
        username: 'userName',
        email: 'test@email.com',
        sshPublicKey: 'ssh-key Public'
      }

      // When
      const returns = mappingService.mapUser(userFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'id',
        name: 'name',
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        email: 'test@email.com',
        sshKeyPublic: 'ssh-key Public'
      })
    })
  })

  describe('map stack', () => {
    let reorderBricksSpy

    beforeEach(() => {
      reorderBricksSpy = sinon.stub(mappingService, 'reorderBricks', data => data)
    })

    afterEach(() => {
      mappingService.reorderBricks.restore()
    })

    it('should map stack from project config', () => {
      // Given
      const stackFromApi = {
        type: 'type',
        name: 'name',
        brickConfigs: [
          'brick1',
          'brick2'
        ]
      }

      // When
      const returns = mappingService.mapStack(stackFromApi)

      // Then
      expect(returns).to.deep.equal({
        type: 'type',
        name: 'name',
        bricks: [
          'brick1',
          'brick2'
        ]
      })
      expect(reorderBricksSpy).to.have.callCount(1)
      expect(reorderBricksSpy).to.have.been.calledWith(stackFromApi.brickConfigs)
    })

    it('should map stack from project ', () => {
      // Given
      const stackFromApi = {
        type: 'type',
        name: 'name',
        brickStates: [
          'brick1',
          'brick2'
        ]
      }

      // When
      const returns = mappingService.mapStack(stackFromApi)

      // Then
      expect(returns).to.deep.equal({
        type: 'type',
        name: 'name',
        bricks: [
          'brick1',
          'brick2'
        ]
      })
      expect(reorderBricksSpy).to.have.callCount(1)
      expect(reorderBricksSpy).to.have.been.calledWith(stackFromApi.brickStates)
    })
  })

  describe('map brick', () => {
    it('should map brick', () => {
      // Given
      const brickFromApi = {
        type: 'type',
        name: 'name',
        state: 'state',
        url: 'url',
        version: 'version'
      }

      // When
      const returns = mappingService.mapBrick(brickFromApi)

      // Then
      expect(returns).to.deep.equal({
        type: 'type',
        name: 'name',
        state: 'state',
        url: 'url',
        version: 'version'
      })
    })
  })

  describe('map project config', () => {
    afterEach(() => {
      mappingService.mapStack.restore()
    })

    it('should map project config', () => {
      // Given
      const projectConfigFromApi = {
        identifier: 'id',
        name: 'name',
        admins: [
          { identifier: '1', name: 'admin1' },
          { identifier: '2', name: 'admin2' }
        ],
        stackConfigs: [
          'stack1',
          'stack2'
        ],
        users: [
          { identifier: '1', name: 'user1' },
          { identifier: '2', name: 'user2' }
        ]
      }
      const mapStackSpy = sinon.stub(mappingService, 'mapStack', data => data)

      // When
      const returns = mappingService.mapProjectConfig(projectConfigFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'id',
        name: 'name',
        admins: [
          '1',
          '2'
        ],
        stacks: [
          'stack1',
          'stack2'
        ],
        users: [
          '1',
          '2'
        ]
      })
      expect(mapStackSpy).to.have.callCount(2)
      expect(mapStackSpy).to.have.been.calledWith('stack1')
      expect(mapStackSpy).to.have.been.calledWith('stack2')
    })
  })

  describe('map project', () => {
    afterEach(() => {
      mappingService.mapStack.restore()
    })

    it('should map project', () => {
      // Given
      const projectFromApi = {
        identifier: 'id',
        projectConfigurationIdentifier: 'projectConfigId',
        name: 'name',
        snapshotDate: 'May 16, 2016 2:11:47 PM',
        stacks: [
          'stack1',
          'stack2'
        ]
      }
      const mapStackSpy = sinon.stub(mappingService, 'mapStack', data => data)

      // When
      const returns = mappingService.mapProject(projectFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'id',
        projectConfigId: 'projectConfigId',
        name: 'name',
        updateDate: 'May 16, 2016 2:11:47 PM',
        stacks: [
          'stack1',
          'stack2'
        ]
      })
      expect(mapStackSpy).to.have.callCount(2)
      expect(mapStackSpy).to.have.been.calledWith('stack1')
      expect(mapStackSpy).to.have.been.calledWith('stack2')
    })
  })

  describe('map brick event', () => {
    it('should map brick event', () => {
      // Given
      const brickEventFromApi = {
        entity: 'entity',
        action: 'action',
        data: {
          projectConfiguration: 'projectConfigId',
          brickType: 'type',
          brickName: 'name',
          state: 'state',
          url: 'url',
          version: 'version'
        }
      }

      // When
      const returns = mappingService.mapBrickEvent(brickEventFromApi)

      // Then
      expect(returns).to.deep.equal({
        entity: 'entity',
        action: 'action',
        brick: {
          type: 'type',
          name: 'name',
          state: 'state',
          url: 'url',
          version: 'version'
        }
      })
    })
  })
})
