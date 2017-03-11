/* eslint-disable no-unused-expressions */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-duplicates */

import { expect } from 'chai'

import paramService from './param.service'

describe('param service', () => {
  describe('status', () => {
    describe('enum', () => {
      it('should add proper values', () => {
        // When
        const enumElements = Object.keys(paramService.enumStatus)

        // Then
        expect(enumElements.length).to.equal(5)
      })
    })

    describe('get status by state label', () => {
      it('should return default status if label does not exist in enum', () => {
        // Given
        const stateLabel = 'DOESNTEXIST'

        // When
        const returned = paramService.getStatusByState(stateLabel)

        // Then
        expect(returned.label).to.equal('UNKNOWN')
        expect(returned.order).to.equal(1)
      })

      it('should return ONFAILURE status', () => {
        // Given
        const stateLabel = 'ONFAILURE'

        // When
        const returned = paramService.getStatusByState(stateLabel)

        // Then
        expect(returned.label).to.equal('ONFAILURE')
        expect(returned.order).to.equal(0)
      })

      it('should return UNKNOWN status', () => {
        // Given
        const stateLabel = 'UNKNOWN'

        // When
        const returned = paramService.getStatusByState(stateLabel)

        // Then
        expect(returned.label).to.equal('UNKNOWN')
        expect(returned.order).to.equal(1)
      })

      it('should return STARTING status', () => {
        // Given
        const stateLabel = 'STARTING'

        // When
        const returned = paramService.getStatusByState(stateLabel)

        // Then
        expect(returned.label).to.equal('STARTING')
        expect(returned.order).to.equal(2)
      })

      it('should return CONFIGURING status', () => {
        // Given
        const stateLabel = 'CONFIGURING'

        // When
        const returned = paramService.getStatusByState(stateLabel)

        // Then
        expect(returned.label).to.equal('CONFIGURING')
        expect(returned.order).to.equal(3)
      })

      it('should return RUNNING status', () => {
        // Given
        const stateLabel = 'RUNNING'

        // When
        const returned = paramService.getStatusByState(stateLabel)

        // Then
        expect(returned.label).to.equal('RUNNING')
        expect(returned.order).to.equal(4)
      })
    })

    describe('get status by order', () => {
      it('should return default status if order not exist in enum', () => {
        // Given
        const stateOrder = -1

        // When
        const returned = paramService.getStatusByOrder(stateOrder)

        // Then
        expect(returned.label).to.equal('UNKNOWN')
        expect(returned.order).to.equal(1)
      })

      it('should return ONFAILURE status', () => {
        // Given
        const stateOrder = 0

        // When
        const returned = paramService.getStatusByOrder(stateOrder)

        // Then
        expect(returned.label).to.equal('ONFAILURE')
        expect(returned.order).to.equal(0)
      })

      it('should return UNKNOWN status', () => {
        // Given
        const stateOrder = 1

        // When
        const returned = paramService.getStatusByOrder(stateOrder)

        // Then
        expect(returned.label).to.equal('UNKNOWN')
        expect(returned.order).to.equal(1)
      })

      it('should return STARTING status', () => {
        // Given
        const stateOrder = 2

        // When
        const returned = paramService.getStatusByOrder(stateOrder)

        // Then
        expect(returned.label).to.equal('STARTING')
        expect(returned.order).to.equal(2)
      })

      it('should return CONFIGURING status', () => {
        // Given
        const stateOrder = 3

        // When
        const returned = paramService.getStatusByOrder(stateOrder)

        // Then
        expect(returned.label).to.equal('CONFIGURING')
        expect(returned.order).to.equal(3)
      })

      it('should return RUNNING status', () => {
        // Given
        const stateOrder = 4

        // When
        const returned = paramService.getStatusByOrder(stateOrder)

        // Then
        expect(returned.label).to.equal('RUNNING')
        expect(returned.order).to.equal(4)
      })
    })

    describe('brick logo', () => {
      describe('enum', () => {
        it('should add proper values', () => {
          // When
          const enumElements = Object.keys(paramService.enumBrickLogos)

          // Then
          expect(enumElements.length).to.equal(4)
        })
      })

      describe('get brick logo', () => {
        it('should return undefined if name does not exist in enum', () => {
          // Given
          const brickName = 'DOESNTEXIST'

          // When
          const returned = paramService.getBrickLogo(brickName)

          // Then
          expect(returned).to.be.undefined
        })

        it('should return gitlab brick logo', () => {
          // Given
          const brickName = 'gitlab'

          // When
          const returned = paramService.getBrickLogo(brickName)

          // Then
          expect(returned.name).to.be.equal('gitlab')
        })

        it('should return jenkins brick logo', () => {
          // Given
          const brickName = 'jenkins'

          // When
          const returned = paramService.getBrickLogo(brickName)

          // Then
          expect(returned.name).to.be.equal('jenkins')
        })

        it('should return nexus brick logo', () => {
          // Given
          const brickName = 'nexus'

          // When
          const returned = paramService.getBrickLogo(brickName)

          // Then
          expect(returned.name).to.be.equal('nexus')
        })

        it('should return dockerregistry brick logo', () => {
          // Given
          const brickName = 'dockerregistry'

          // When
          const returned = paramService.getBrickLogo(brickName)

          // Then
          expect(returned.name).to.be.equal('dockerregistry')
        })
      })

      describe('get menu', () => {
        it('should return default menu', () => {
          // When
          const menu = paramService.getMenu()

          // Then
          expect(Object.keys(menu).length).to.equal(4)
        })
      })

      describe('groups', () => {
        describe('enum', () => {
          it('should add proper values', () => {
            // When
            const enumElements = Object.keys(paramService.enumGroups)

            // Then
            expect(enumElements.length).to.equal(4)
          })
        })

        describe('get group by id', () => {
          it('should return undefined if id does not exist in enum', () => {
            // Given
            const groupId = -1

            // When
            const returned = paramService.getGroupById(groupId)

            // Then
            expect(returned).to.be.undefined
          })

          it('should return USER group', () => {
            // Given
            const groupId = 0

            // When
            const returned = paramService.getGroupById(groupId)

            // Then
            expect(returned.label).to.equal('USER')
            expect(returned.id).to.equal(groupId)
          })

          it('should return TEAM_LEADER group', () => {
            // Given
            const groupId = 1

            // When
            const returned = paramService.getGroupById(groupId)

            // Then
            expect(returned.label).to.equal('TEAM_LEADER')
            expect(returned.id).to.equal(groupId)
          })

          it('should return ADMIN group', () => {
            // Given
            const groupId = 2

            // When
            const returned = paramService.getGroupById(groupId)

            // Then
            expect(returned.label).to.equal('ADMIN')
            expect(returned.id).to.equal(groupId)
          })

          it('should return ROOT group', () => {
            // Given
            const groupId = 3

            // When
            const returned = paramService.getGroupById(groupId)

            // Then
            expect(returned.label).to.equal('ROOT')
            expect(returned.id).to.equal(groupId)
          })
        })

        describe('get group by label', () => {
          it('should return undefined if label does not exist in enum', () => {
            // Given
            const groupLabel = 'DOESNTEXIST'

            // When
            const returned = paramService.getGroupByLabel(groupLabel)

            // Then
            expect(returned).to.be.undefined
          })

          it('should return USER group', () => {
            // Given
            const groupLabel = 'USER'

            // When
            const returned = paramService.getGroupByLabel(groupLabel)

            // Then
            expect(returned.label).to.equal(groupLabel)
            expect(returned.id).to.equal(0)
          })

          it('should return TEAM_LEADER group', () => {
            // Given
            const groupLabel = 'TEAM_LEADER'

            // When
            const returned = paramService.getGroupByLabel(groupLabel)

            // Then
            expect(returned.label).to.equal(groupLabel)
            expect(returned.id).to.equal(1)
          })

          it('should return ADMIN group', () => {
            // Given
            const groupLabel = 'ADMIN'

            // When
            const returned = paramService.getGroupByLabel(groupLabel)

            // Then
            expect(returned.label).to.equal(groupLabel)
            expect(returned.id).to.equal(2)
          })

          it('should return ROOT group', () => {
            // Given
            const groupLabel = 'ROOT'

            // When
            const returned = paramService.getGroupByLabel(groupLabel)

            // Then
            expect(returned.label).to.equal(groupLabel)
            expect(returned.id).to.equal(3)
          })

        })
      })
    })
  })
})
