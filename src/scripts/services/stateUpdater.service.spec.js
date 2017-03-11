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

import stateUpdaterService from './stateUpdater.service'

describe('state updater service', () => {
  describe('update bricks', () => {
    let prevBricks

    beforeEach(() => {
      prevBricks = [
        {
          type: 'CI',
          name: 'jenkins',
          state: 'UNKNOWN',
          version: '1.651',
          url: 'https://ci-project.kodokojo.io'
        },
        { type: 'SCM',
          name: 'gitlab',
          state: 'RUNNING',
          version: '8.5.2-ce',
          url: 'https://scm-jpascal.kodokojo.io'
        }
      ]
    })

    it('should return previous bricks if bricks is an empty array', () => {
      // Given
      const bricks = []

      // When
      const returned = stateUpdaterService.updateBricks(prevBricks, bricks)
   
      // Then
      expect(returned).to.deep.equal(prevBricks)
    })

    it('should return previous bricks if brick element is undefined', () => {
      // Given
      const bricks = [ 
        undefined
      ]

      // When
      const returned = stateUpdaterService.updateBricks(prevBricks, bricks)

      // Then
      expect(returned).to.deep.equal(prevBricks)
    })

    it('should update each previous brick', () => {
      // Given
      const bricks = [
        {
          type: 'CI',
          name: 'jenkins',
          state: 'NEWSTATE',
          version: 'newVersion',
          url: 'https://ci-newproject.kodokojo.io'
        }
      ]

      // When
      const returned = stateUpdaterService.updateBricks(prevBricks, bricks)

      // Then
      expect(returned[0]).to.deep.equal(bricks[0])
    })

    describe('compute aggregated stack status', () => {
      let getStatusByOrderSpy
      let getStatusByStateSpy
      let enumStatus

      beforeEach(() => {
        enumStatus = {
          'ONFAILURE': {
            state: 'ONFAILURE',
            order: 0
          },
          'UNKNOWN': {
            state: 'UNKNOWN', 
            order: 1
          },
          'RUNNING': {
            state: 'RUNNING',
            order: 4
          }
        }

        getStatusByOrderSpy = sinon.stub()
        getStatusByOrderSpy.withArgs(0).returns(enumStatus['ONFAILURE'])
        getStatusByOrderSpy.withArgs(1).returns(enumStatus['UNKNOWN'])
        getStatusByOrderSpy.withArgs(4).returns(enumStatus['RUNNING'])
        stateUpdaterService.__Rewire__('getStatusByOrder', getStatusByOrderSpy)

        getStatusByStateSpy = sinon.stub()
        getStatusByStateSpy.withArgs('DEFAULT').returns('UNKNOWN')
        getStatusByStateSpy.withArgs('STATE').returns('STATE')
        getStatusByStateSpy.withArgs('ONFAILURE').returns(enumStatus['ONFAILURE'])
        getStatusByStateSpy.withArgs('UNKNOWN').returns(enumStatus['UNKNOWN'])
        getStatusByStateSpy.withArgs('RUNNING').returns(enumStatus['RUNNING'])
        stateUpdaterService.__Rewire__('getStatusByState', getStatusByStateSpy)
      })

      afterEach(() => {
        stateUpdaterService.__ResetDependency__('getStatusByOrder')
        stateUpdaterService.__ResetDependency__('getStatusByState')
      })

      it('should return DEFAULT status if bricks length = 0', () => {
        // Given
        const bricks = []

        // When
        const returned = stateUpdaterService.computeAggregatedStackStatus(bricks)

        // Then
        expect(returned).to.equal('UNKNOWN')
        expect(getStatusByStateSpy).to.have.callCount(1)
        expect(getStatusByStateSpy).to.have.calledWith('DEFAULT')
      })

      it('should return bricks state status if bricks length = 1', () => {
        // Given
        const bricks = [
          {
            state: 'STATE'
          }
        ]

        // When
        const returned = stateUpdaterService.computeAggregatedStackStatus(bricks)

        // Then
        expect(returned).to.equal('STATE')
        expect(getStatusByStateSpy).to.have.callCount(1)
        expect(getStatusByStateSpy).to.have.calledWith('STATE')
      })

      it('should return bricks minimum state order status', () => {
        // Given
        const bricks = [
          {
            state: 'UNKNOWN'
          },
          {
            state: 'RUNNING'
          },
          {
            state: 'ONFAILURE'
          }
        ]

        // When
        const returned = stateUpdaterService.computeAggregatedStackStatus(bricks)

        // Then
        expect(returned.state).to.equal('ONFAILURE')
        expect(getStatusByStateSpy).to.have.callCount(3)
        expect(getStatusByOrderSpy).to.have.callCount(1)
        expect(getStatusByOrderSpy).to.have.been.calledWith(0)
      })
    })

    describe('remove user', () => {
      it('should return previous user if user to delete <= 0', () => {
        // Given
        const prevUsers = [
          { 1: 'user' }
        ]
        const usersToDelte = []

        // When
        const returned = stateUpdaterService.removeUsers(prevUsers, usersToDelte)

        // Then
        expect(returned).to.deep.equal(prevUsers)
      })

      it('should return users without deleted ones', () => {
        // Given
        const prevUsers = [ 1, 2, 3, 4, 5 ]
        const usersToDelte = [ 1, 4 ]

        // When
        const returned = stateUpdaterService.removeUsers(prevUsers, usersToDelte)

        // Then
        expect(returned).to.deep.equal([ 2, 3, 5])
      })
    })

    describe('filter checked members', () => {
      it('should empty array if no user is checked', () => {
        // Given
        const users = [
          {
            checked: false
          }
        ]

        // When
        const returned = stateUpdaterService.filterCheckedMembers(users)

        // Then
        expect(returned).to.deep.equal([])
      })

      it('should array of checked users indexes', () => {
        // Given
        const users = [
          {
            checked: true
          },
          {
            checked: false
          },
          {
            checked: true
          }
        ]

        // When
        const returned = stateUpdaterService.filterCheckedMembers(users)

        // Then
        expect(returned).to.deep.equal([0, 2])
      })
    })
  })
})