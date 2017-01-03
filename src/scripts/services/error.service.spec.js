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

import { expect } from 'chai'

import { returnErrorKey } from './error.service'

describe('error service', () => {
  describe('returnError key', () => {
    it('should return default key', () => {
      // Given
      const errorObject = {}

      // When
      const returns = returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('error')
    })

    it('should return key with component', () => {
      // Given
      const errorObject = {
        component: 'component'
      }

      // When
      const returns = returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('component-error')
    })

    it('should return key with action', () => {
      // Given
      const errorObject = {
        action: 'action'
      }

      // When
      const returns = returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('action-error')
    })

    it('should return key with code', () => {
      // Given
      const errorObject = {
        code: '404'
      }

      // When
      const returns = returnErrorKey(errorObject)

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
      const returns = returnErrorKey(errorObject)

      // Then
      expect(returns).to.equal('component-do-something-error-404')
    })
  })
})
