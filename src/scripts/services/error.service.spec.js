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


import errorService from './error.service'

describe('error service', () => {
  describe('return error key', () => {
    it('should return default key', () => {
      // Given
      const errorObject = {}

      // When
      const returns = errorService.returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('error')
    })

    it('should return key with component', () => {
      // Given
      const errorObject = {
        component: 'component'
      }

      // When
      const returns = errorService.returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('component-error')
    })

    it('should return key with action', () => {
      // Given
      const errorObject = {
        action: 'action'
      }

      // When
      const returns = errorService.returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('action-error')
    })

    it('should return key with code', () => {
      // Given
      const errorObject = {
        code: '404'
      }

      // When
      const returns = errorService.returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('error-404')
    })

    it('should return key with all parameters', () => {
      // Given
      const errorObject = {
        component: 'component',
        action: 'do-something',
        code: '404'
      }

      // When
      const returns = errorService.returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('component-do-something-error-404')
    })

    describe('return error key or message', () => {
      let returnErrorKeySpy

      afterEach(() => {
        errorService.returnErrorKey.restore()
      })

      it('should call return error key on 404', () => {
        // Given
        const errorObject = {
          component: 'component',
          action: 'do-something',
          message: '404'
        }
        returnErrorKeySpy = sinon.stub(errorService, 'returnErrorKey')
  
        // When
        errorService.returnErrorKeyOrMessage(errorObject)
  
        // Then
        expect(returnErrorKeySpy).to.have.callCount(1)
      })

      it('should call return error key on 500', () => {
        // Given
        const errorObject = {
          component: 'component',
          action: 'do-something',
          message: '500'
        }
        returnErrorKeySpy = sinon.stub(errorService, 'returnErrorKey')
  
        // When
        errorService.returnErrorKeyOrMessage(errorObject)
  
        // Then
        expect(returnErrorKeySpy).to.have.callCount(1)
      })

      it('should return message on none valid code 4044', () => {
        // Given
        const errorObject = {
          component: 'component',
          action: 'do-something',
          message: '4044'
        }
        returnErrorKeySpy = sinon.stub(errorService, 'returnErrorKey')
  
        // When
        const returns = errorService.returnErrorKeyOrMessage(errorObject)
  
        // Then
        expect(returns).to.deep.equal(errorObject.message)
        expect(returnErrorKeySpy).to.have.callCount(0)
      })

      it('should return message on none valid code 50', () => {
        // Given
        const errorObject = {
          component: 'component',
          action: 'do-something',
          message: '50'
        }
        returnErrorKeySpy = sinon.stub(errorService, 'returnErrorKey')
  
        // When
        const returns = errorService.returnErrorKeyOrMessage(errorObject)
  
        // Then
        expect(returns).to.deep.equal(errorObject.message)
        expect(returnErrorKeySpy).to.have.callCount(0)
      })

      it('should return message on code 300', () => {
        // Given
        const errorObject = {
          component: 'component',
          action: 'do-something',
          message: '300'
        }
        returnErrorKeySpy = sinon.stub(errorService, 'returnErrorKey')
  
        // When
        const returns = errorService.returnErrorKeyOrMessage(errorObject)
  
        // Then
        expect(returns).to.deep.equal(errorObject.message)
        expect(returnErrorKeySpy).to.have.callCount(0)
      })

      it('should return message on message string', () => {
        // Given
        const errorObject = {
          component: 'component',
          action: 'do-something',
          message: 'This is an error message'
        }
        returnErrorKeySpy = sinon.stub(errorService, 'returnErrorKey')
  
        // When
        const returns = errorService.returnErrorKeyOrMessage(errorObject)
  
        // Then
        expect(returns).to.deep.equal(errorObject.message)
        expect(returnErrorKeySpy).to.have.callCount(0)
      })
    })
  })
})
