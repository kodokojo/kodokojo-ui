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
    let accountFromApi

    beforeEach(() => {
      accountFromApi = {
        identifier: 'identifier',
        name: 'name',
        username: 'username',
        email: 'email',
        password: 'password',
        sshPublicKey: 'sshPublicKey',
        privateKey: 'privateKey',
        entityIdentifier: 'entityIdentifier'
      }
    })

    afterEach(() => {
      mappingService.mapProjectConfigId.restore()
    })

    it('should map account without project config ids', () => {
      // Given
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
        projectConfigIds: undefined
      })
      expect(mapProjectConfigIdSpy).to.have.callCount(0)
    })

    it('should map account with project config ids', () => {
      // Given
      accountFromApi.projectConfigurationIds = [
        'projectConfig1',
        'projectConfig2'
      ]
      
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

  describe('map user output', () => {
    it('should map user output', () => {
      // Given
      const userFromUi = {
        id: 'id',
        name: 'name',
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        email: 'test@email.com',
        sshKeyPublic: 'ssh-key Public',
        password: 'password'
      }

      // When
      const returns = mappingService.mapUserOutput(userFromUi)

      // Then
      expect(returns).to.deep.equal({
        identifier: 'id',
        firstName: 'firstName',
        lastName: 'lastName',
        name: 'name',
        username: 'userName',
        email: 'test@email.com',
        sshPublicKey: 'ssh-key Public',
        password: 'password'
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

    it('should map stack from project', () => {
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

    it('should map stack from events', () => {
      // Given
      const stackFromApi = {
        stackType: 'type',
        name: 'name',
        brickStateEvents: [
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
      expect(reorderBricksSpy).to.have.been.calledWith(stackFromApi.brickStateEvents)
    })

    it('should map stack with not matching bricks key', () => {
      // Given
      const stackFromApi = {
        type: 'type',
        name: 'name',
        nomatch: [
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
        bricks: []
      })
      expect(reorderBricksSpy).to.have.callCount(0)
    })

    it('should map stack with empty bricks', () => {
      // Given
      const stackFromApi = {
        type: 'type',
        name: 'name',
        brcikConfigs: []
      }

      // When
      const returns = mappingService.mapStack(stackFromApi)

      // Then
      expect(returns).to.deep.equal({
        type: 'type',
        name: 'name',
        bricks: []
      })
      expect(reorderBricksSpy).to.have.callCount(0)
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

    it('should map brick alternate keys', () => {
      // Given
      const brickFromApi = {
        brickType: 'type',
        brickName: 'name',
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

    it('should return undefined if data type is LOADBALANCER', () => {
      // Given
      const brickFromApi = {
        type: 'LOADBALANCER',
        name: 'name',
        state: 'state',
        url: 'url',
        version: 'version'
      }

      // When
      const returns = mappingService.mapBrick(brickFromApi)

      // Then
      expect(returns).to.be.undefined
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

    it('should map project config with undefined admin, stacks and users', () => {
      // Given
      const projectConfigFromApi = {
        identifier: 'id',
        name: 'name'
      }
      const mapStackSpy = sinon.stub(mappingService, 'mapStack', data => data)

      // When
      const returns = mappingService.mapProjectConfig(projectConfigFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'id',
        name: 'name',
        admins: undefined,
        stacks: undefined,
        users: undefined
      })
      expect(mapStackSpy).to.have.callCount(0)
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

    it('should map project with undefined stack', () => {
      // Given
      const projectFromApi = {
        identifier: 'id',
        projectConfigurationIdentifier: 'projectConfigId',
        name: 'name',
        snapshotDate: 'May 16, 2016 2:11:47 PM'
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
        stacks: undefined
      })
      expect(mapStackSpy).to.have.callCount(0)
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

    describe('map brick details', () => {
      afterEach(() => {
        mappingService.reorderBricks.restore()
      })

      it('should map brick list', () => {
        // Given
        const brickList = [
          {
            type: 'type1',
            name: 'name',
            state: 'state',
            url: 'url',
            version: 'version'
          },
          {
            type: 'type2',
            name: 'name',
            state: 'state',
            url: 'url',
            version: 'version'
          }
        ]
        const reorderBricksSpy = sinon.stub(mappingService, 'reorderBricks', data => data)

        // When
        const returns = mappingService.mapBricksDetails(brickList)

        // Then
        expect(returns).to.deep.equal({
          bricks: brickList
        })
        expect(reorderBricksSpy).to.have.callCount(1)
        expect(reorderBricksSpy).to.have.been.calledWith(brickList)
      })

      it('should map empty brick list to empty array', () => {
        // Given
        const brickList = []
        const reorderBricksSpy = sinon.stub(mappingService, 'reorderBricks')

        // When
        const returns = mappingService.mapBricksDetails(brickList)

        // Then
        expect(returns).to.deep.equal({
          bricks: []
        })
        expect(reorderBricksSpy).to.have.callCount(0)
      })
    })

    describe('group bricks', () => {
      afterEach(() => {
        mappingService.groupBricks.restore()
      })

      it('should reorder bricks by type', () => {
        // Given
        const brickList = [
          {
            type: 'SCM',
            name: 'Scm1'
          },
          {
            type: 'SCM',
            name: 'Scm2'
          },
          {
            type: 'CI',
            name: 'Ci1'
          },
          {
            type: 'CI',
            name: 'Ci2'
          },
          {
            type: 'REPOSITORY',
            name: 'R1'
          }
        ]
        const groupBricksSpy = sinon.stub(mappingService, 'groupBricks').returns({
          SCM: [
            {
              type: 'SCM',
              name: 'Scm1'
            },
            {
              type: 'SCM',
              name: 'Scm2'
            }
          ],
          CI: [
            {
              type: 'CI',
              name: 'Ci1'
            },
            {
              type: 'CI',
              name: 'Ci2'
            }
          ],
          REPOSITORY: [
            {
              type: 'REPOSITORY',
              name: 'R1'
            }
          ]
        })

        // When
        const returns = mappingService.reorderBricks(brickList)

        // Then
        expect(returns).to.deep.equal([
          [
            {
              type: 'SCM',
              name: 'Scm1'
            },
            {
              type: 'SCM',
              name: 'Scm2'
            }
          ],
          [
            {
              type: 'CI',
              name: 'Ci1'
            },
            {
              type: 'CI',
              name: 'Ci2'
            }
          ],
          [
            {
              type: 'REPOSITORY',
              name: 'R1'
            }
          ]
        ])
        expect(groupBricksSpy).to.have.callCount(1)
        expect(groupBricksSpy).to.have.been.calledWith(brickList)
      })

      it('should reorder bricks by type and filter undefined', () => {
        // Given
        const brickList = [
          {
            type: 'SCM',
            name: 'Scm1'
          },
          {
            type: 'SCM',
            name: 'Scm2'
          },
          {
            type: 'CI',
            name: 'Ci1'
          },
          {
            type: 'CI',
            name: 'Ci2'
          }
        ]
        const groupBricksSpy = sinon.stub(mappingService, 'groupBricks').returns({
          SCM: [
            {
              type: 'SCM',
              name: 'Scm1'
            },
            {
              type: 'SCM',
              name: 'Scm2'
            }
          ],
          CI: [
            {
              type: 'CI',
              name: 'Ci1'
            },
            {
              type: 'CI',
              name: 'Ci2'
            }
          ]
        })

        // When
        const returns = mappingService.reorderBricks(brickList)

        // Then
        expect(returns).to.deep.equal([
          [
            {
              type: 'SCM',
              name: 'Scm1'
            },
            {
              type: 'SCM',
              name: 'Scm2'
            }
          ],
          [
            {
              type: 'CI',
              name: 'Ci1'
            },
            {
              type: 'CI',
              name: 'Ci2'
            }
          ]
        ])
        expect(groupBricksSpy).to.have.callCount(1)
        expect(groupBricksSpy).to.have.been.calledWith(brickList)
      })
    })

    describe('reorder bricks', () => {
      afterEach(() => {
        mappingService.mapBrick.restore()
      })

      it('should reorder bricks by type', () => {
        // Given
        const brickList = [
          {
            type: 'SCM',
            name: 'Scm1'
          },
          {
            type: 'SCM',
            name: 'Scm2'
          },
          {
            type: 'CI',
            name: 'Ci1'
          },
          {
            type: 'CI',
            name: 'Ci2'
          },
          {
            type: 'REPOSITORY',
            name: 'R1'
          }
        ]
        const mapBrickSpy = sinon.stub(mappingService, 'mapBrick', data => data)

        // When
        const returned = mappingService.groupBricks(brickList)

        // Then
        expect(returned).to.deep.equal({
          SCM: [
            {
              type: 'SCM',
              name: 'Scm1'
            },
            {
              type: 'SCM',
              name: 'Scm2'
            }
          ],
          CI: [
            {
              type: 'CI',
              name: 'Ci1'
            },
            {
              type: 'CI',
              name: 'Ci2'
            }
          ],
          REPOSITORY: [
            {
              type: 'REPOSITORY',
              name: 'R1'
            }
          ]
        })
        expect(mapBrickSpy).to.have.callCount(5)
      })
    })
  })
})
