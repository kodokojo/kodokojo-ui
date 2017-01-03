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

import ioService from './io.service'

describe('io service', () => {
  describe('getHeaders method', () => {
    afterEach(() => {
      ioService.__ResetDependency__('getToken')
    })

    it('should return basic headers', () => {
      // Given
      const getTokenSpy = sinon.stub().returns('')
      ioService.__Rewire__('getToken', getTokenSpy)

      // When
      const returned = ioService.getHeaders()

      // Then
      expect(returned).to.be.deep.equal({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
      expect(getTokenSpy).to.have.callCount(1)
      expect(getTokenSpy).to.have.calledWith()
    })

    it('should return headers with autorization set', () => {
      // Given
      const getTokenSpy = sinon.stub().returns('token')
      ioService.__Rewire__('getToken', getTokenSpy)

      // When
      const returned = ioService.getHeaders()

      // Then
      expect(returned).to.be.deep.equal({
        Accept: 'application/json',
        Authorization: 'Basic token',
        'Content-Type': 'application/json'
      })
      expect(getTokenSpy).to.have.callCount(1)
      expect(getTokenSpy).to.have.calledWith()
    })

    it('should return headers merged wioth param', () => {
      // Given
      const getTokenSpy = sinon.stub().returns('token')
      ioService.__Rewire__('getToken', getTokenSpy)
      const customHeaders = {
        Accept: 'application/xml',
        Authorization: 'is not rewritable',
        SuperCustomHeader: 'super'
      }

      // When
      const returned = ioService.getHeaders(customHeaders)

      // Then
      expect(returned).to.be.deep.equal({
        Accept: 'application/xml',
        Authorization: 'Basic token',
        'Content-Type': 'application/json',
        SuperCustomHeader: 'super'
      })
      expect(getTokenSpy).to.have.callCount(1)
      expect(getTokenSpy).to.have.calledWith()
    })
  })
})
