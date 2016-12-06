/**
 * Kodo Kojo - Software factory done right
 * Copyright © 2016 Kodo Kojo (infos@kodokojo.io)
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

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import loginValidator from './login.validator'

describe('login validator', () => {
  let values

  it('should return required error on empty username', () => {
    // Given
    values = {
      username: '',
      password: 'password'
    }

    // When
    const result = loginValidator(values)
    
    // Then
    expect(result).to.deep.equal({
      username: 'general-input-error-required'
    })
  })

  it('should return required error on empty password', () => {
    // Given
    values = {
      username: 'username',
      password: ''
    }

    // When
    const result = loginValidator(values)
    
    // Then
    expect(result).to.deep.equal({
      password: 'general-input-error-required'
    })
  })

  it('should return emtpy object if username and password are ok', () => {
    // Given
    values = {
      username: 'username',
      password: 'password'
    }

    // When
    const result = loginValidator(values)
    
    // Then
    expect(result).to.deep.equal({})
  })
})
