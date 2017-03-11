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

import validatorService from './validator.service'

describe('validator service', () => {
  describe('is alphabetic extended', () => {
    it('should return false if not alphanumeric', () => {
      // Given
      const test = '!'

      // When
      const returns = validatorService.isAlphabeticExtended(test)

      // Then
      expect(returns).to.be.false
    })

    it('should return true if numeric', () => {
      // Given
      const test = 123

      // When
      const returns = validatorService.isAlphabeticExtended(test)

      // Then
      expect(returns).to.be.true
    })

    it('should return true if alphanumeric', () => {
      // Given
      const test = 'abc12'

      // When
      const returns = validatorService.isAlphabeticExtended(test)

      // Then
      expect(returns).to.be.true
    })

    it('should return true if some special characters', () => {
      // Given
      const test = '- \'’'

      // When
      const returns = validatorService.isAlphabeticExtended(test)

      // Then
      expect(returns).to.be.true
    })
  })

  describe('is project name valid', () => {
    it('should return true if name is 4 - 20 alphanumeric', () => {
      // Given
      const test = 'valid-Project1_'

      // When
      const returns = validatorService.isProjectNameValid(test)

      // Then
      expect(returns).to.be.true
    })

    it('should return true if name is 4 characters long', () => {
      // Given
      const strLen = 4
      const test = new Array(strLen + 1).join('a')

      // When
      const returns = validatorService.isProjectNameValid(test)

      // Then
      expect(returns).to.be.true
    })

    it('should return true if name is 20 characters long', () => {
      // Given
      const strLen = 20
      const test = new Array(strLen + 1).join('a')

      // When
      const returns = validatorService.isProjectNameValid(test)

      // Then
      expect(returns).to.be.true
    })

    it('should return false if name contains space', () => {
      // Given
      const test = 'not valid'

      // When
      const returns = validatorService.isProjectNameValid(test)

      // Then
      expect(returns).to.be.false
    })

    it('should return false if name is less than 4 characters long', () => {
      // Given
      const strLen = 3
      const test = new Array(strLen + 1).join('a')

      // When
      const returns = validatorService.isProjectNameValid(test)

      // Then
      expect(returns).to.be.false
    })

    it('should return false if name is 21 characters long', () => {
      // Given
      const strLen = 21
      const test = new Array(strLen + 1).join('a')

      // When
      const returns = validatorService.isProjectNameValid(test)

      // Then
      expect(returns).to.be.false
    })

    describe('is password valid', () => {
      it('should return true if it is 8 - 20 alphanumeric', () => {
        // Given
        const test = 'valid!#@%=/_Password'

        // When
        const returns = validatorService.isPasswordValid(test)

        // Then
        expect(returns).to.be.true
      })

      it('should return true if it is 8 characters', () => {
        // Given
        const strLen = 8
        const test = new Array(strLen + 1).join('a')

        // When
        const returns = validatorService.isPasswordValid(test)

        // Then
        expect(returns).to.be.true
      })

      it('should return false if it is 7 characters', () => {
        // Given
        const strLen = 7
        const test = new Array(strLen + 1).join('a')

        // When
        const returns = validatorService.isPasswordValid(test)

        // Then
        expect(returns).to.be.false
      })

      it('should return true if it is 256 characters', () => {
        // Given
        const strLen = 256
        const test = new Array(strLen + 1).join('a')

        // When
        const returns = validatorService.isPasswordValid(test)

        // Then
        expect(returns).to.be.true
      })

      it('should return false if it is 257 characters', () => {
        // Given
        const strLen = 257
        const test = new Array(strLen + 1).join('a')

        // When
        const returns = validatorService.isPasswordValid(test)

        // Then
        expect(returns).to.be.false
      })

      it('should return false if contains a space', () => {
        // Given
        const test = 'valid !#@%=/_Password'

        // When
        const returns = validatorService.isPasswordValid(test)

        // Then
        expect(returns).to.be.false
      })
    })

    describe('is SSH key valid', () => {
      it('should return true if start with ssh-', () => {
        const test = 'ssh-mkdjhfmkhflekrhflehir'
        
        // When
        const returns = validatorService.isSSHKeyValid(test)

        // Then
        expect(returns).to.be.true
      })

      it('should return false if not start with ssh-', () => {
        const test = 'sh-mkdjhfmkhflekrhflehir'
        
        // When
        const returns = validatorService.isSSHKeyValid(test)

        // Then
        expect(returns).to.be.false
      })
    })
  })
})