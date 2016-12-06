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
