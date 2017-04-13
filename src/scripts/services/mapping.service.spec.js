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
    let mapOrganisationSpy

    beforeEach(() => {
      accountFromApi = {
        identifier: 'identifier',
        name: 'name',
        username: 'username',
        email: 'email',
        password: 'password',
        sshPublicKey: 'sshPublicKey',
        privateKey: 'privateKey',
        isRoot: false,
      }
      mapOrganisationSpy = sinon.stub(mappingService, 'mapOrganisation', data => data)
    })

    afterEach(() => {
      mappingService.mapOrganisation.restore()
    })

    it('should map account without organisations', () => {
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
        isRoot: false,
        organisations: []
      })
      expect(mapOrganisationSpy).to.have.callCount(0)
    })

    it('should map account with organisations', () => {
      // Given
      accountFromApi.organisations = [
        'organisation1',
        'organisation2'
      ]

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
        isRoot: false,
        organisations: accountFromApi.organisations
      })
      expect(mapOrganisationSpy).to.have.callCount(2)
      expect(mapOrganisationSpy).to.have.been.calledWith(accountFromApi.organisations[0])
      expect(mapOrganisationSpy).to.have.been.calledWith(accountFromApi.organisations[1])
    })
  })

  describe('map organisation', () => {
    let organisationFromApi
    let mapOrganisationProjectConfigSpy

    beforeEach(() => {
      organisationFromApi = {
        identifier: 'identifier',
        name: 'name',
        right: 'RIGHT',
        nbUserTotal: 1,
        nbProjectTotal: 2
      }
      mapOrganisationProjectConfigSpy = sinon.stub(mappingService, 'mapOrganisationProjectConfig', data => data)
    })

    afterEach(() => {
      mappingService.mapOrganisationProjectConfig.restore()
    })

    it('should map organisation from account without project configurations', () => {
      // When
      const returns = mappingService.mapOrganisation(organisationFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'identifier',
        name: 'name',
        group: 'RIGHT',
        projectConfigs: [],
        usersNumber: 1,
        projectConfigsNumber: 2
      })
      expect(mapOrganisationProjectConfigSpy).to.have.callCount(0)
    })

    it('should map organisation from account with project configurations', () => {
      // Given
      organisationFromApi.projectConfigurations = [
        'projectConfig1',
        'projectConfig2'
      ]

      // When
      const returns = mappingService.mapOrganisation(organisationFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'identifier',
        name: 'name',
        group: 'RIGHT',
        projectConfigs: organisationFromApi.projectConfigurations,
        usersNumber: 1,
        projectConfigsNumber: 2
      })
      expect(mapOrganisationProjectConfigSpy).to.have.callCount(2)
      expect(mapOrganisationProjectConfigSpy).to.have.been.calledWith(organisationFromApi.projectConfigurations[0])
      expect(mapOrganisationProjectConfigSpy).to.have.been.calledWith(organisationFromApi.projectConfigurations[1])
    })
  })

  describe('map organisation project config', () => {
    it('should map organisation project config', () => {
      // Given
      const organisationProjectConfigFromApi = {
        identifier: 'id',
        projectName: 'name',
        projectId: 'projectId',
        isTeamLeader: true
      }

      // When
      const returns = mappingService.mapOrganisationProjectConfig(organisationProjectConfigFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'id',
        name: 'name',
        project:{
          id: 'projectId'
        },
        isTeamLeader: true
      })
    })
    it('should map organisation project config alternate keys', () => {
      // Given
      const organisationProjectConfigFromApi = {
        identifier: 'id',
        name: 'name',
        projectId: 'projectId',
        isTeamLeader: true
      }

      // When
      const returns = mappingService.mapOrganisationProjectConfig(organisationProjectConfigFromApi)

      // Then
      expect(returns).to.deep.equal({
        id: 'id',
        name: 'name',
        project:{
          id: 'projectId'
        },
        isTeamLeader: true
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
        password: 'password',
        group: 'USER',
        organisationId: 'organisationId'
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
        password: 'password',
        isRoot: false,
        organisationId: 'organisationId'
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
        version: 'version',
        message: undefined,
        projectConfigId: undefined,
        stackName: undefined
      })
    })

    it('should map brick alternate keys', () => {
      // Given
      const brickFromApi = {
        brickType: 'type',
        brickName: 'name',
        newState: 'state',
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
        version: 'version',
        message: undefined,
        projectConfigId: undefined,
        stackName: undefined
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
        headers: {
          eventType: 'eventType'
        },
        payload: {
          projectConfiguration: 'projectConfigId',
          brickType: undefined,
          brickName: 'name',
          newState: 'newState',
          url: 'url'
        }
      }

      // When
      const returns = mappingService.mapBrickEvent(brickEventFromApi)

      // Then
      expect(returns).to.deep.equal({
        eventType: 'eventType',
        brick: {
          name: 'name',
          type: undefined,
          state: 'newState',
          url: 'url',
          version: undefined,
          message: undefined,
          projectConfigId: undefined,
          stackName: undefined
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
