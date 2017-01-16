/* eslint-disable no-unused-expressions */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-duplicates */

import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import cloneDeep from 'lodash/cloneDeep'

import crispService from './crisp.service'

describe('crisp service', () => {
  describe('inject', () => {
    let script
    let documentBackup

    beforeEach(() => {
      documentBackup = cloneDeep(document)
      script = {}
    })

    afterEach(() => {
      global.document = documentBackup // eslint-disable-line no-global-assign
    })

    it('should inject script', () => {
      // Given
      global.document = { // eslint-disable-line no-global-assign
        head: {
          appendChild: sinon.spy()
        },
        createElement: sinon.stub().returns(script)
      }

      // When
      crispService.inject()

      // Then
      expect(global.document.head.appendChild).to.have.callCount(1)
      expect(script.id).to.equal('script-crisp')
      expect(script.src).to.equal('https://client.crisp.im/l.js')
      expect(script.type).to.equal('text/javascript')
      expect(script.async).to.be.true
      expect(script.defer).to.be.true
      expect(script.onerror).to.be.a.function
    })

    it('should get head by tag if undefined', () => {
      // Given
      const headAppendChildSpy = sinon.spy()
      global.document = { // eslint-disable-line no-global-assign
        head: undefined,
        getElementsByTagName: sinon.stub().returns([{
          appendChild: headAppendChildSpy
        }]),
        createElement: sinon.stub().returns(script)
      }

      // When
      crispService.inject()

      // Then
      expect(global.document.getElementsByTagName).to.have.callCount(1)
      expect(headAppendChildSpy).to.have.callCount(1)
    })

    it('should set proper onerror callback', () => {
      // Given
      global.document = { // eslint-disable-line no-global-assign
        head: {
          appendChild: sinon.spy()
        },
        createElement: sinon.stub().returns(script)
      }
      const errorObject = {
        target: {
          src: 'some source'
        }
      }

      // When
      crispService.inject()
      const error = () => {
        return script.onerror(errorObject)
      }

      // Then
      expect(error).to.throw(URIError)
      expect(error).to.throw('The script some source is not accessible.')
    })

  })

  describe('init', () => {
    let windowBackup

    afterEach(() => {
      delete window.$crisp
    })

    it('should inject script', () => {
      // Given
      window.$crisp = 'crispLibrary' // eslint-disable-line no-global-assign
        
      // When
      crispService.init()

      // Then
      expect(crispService.crisp).to.equal('crispLibrary')
    })
  })

  describe('put user', () => {
    let initSpy

    beforeEach(() => {
      initSpy = sinon.spy(crispService, 'init')      
    })

    afterEach(() => {
      crispService.init.restore()
    })

    it('should init if crisp is not set', () => {
      // Given
      const account = {}
      crispService.crisp = undefined

      // When
      crispService.putUser(account)

      // Then
      expect(initSpy).to.have.callCount(1)
    })

    it('should call set on account email', () => {
      // Given
      const account = {
        email: 'email'
      }
      crispService.crisp = {
        set: sinon.spy()
      }

      // When
      crispService.putUser(account)

      // Then
      expect(crispService.crisp.set).to.have.callCount(1)
      expect(crispService.crisp.set).to.have.been.calledWithExactly('user:email', account.email)
      expect(initSpy).to.have.callCount(0)
    })

    it('should call set on nickname email', () => {
      // Given
      const account = {
        firstName: 'firstName',
        lastName: 'lastName'
      }
      crispService.crisp = {
        set: sinon.spy()
      }

      // When
      crispService.putUser(account)

      // Then
      expect(crispService.crisp.set).to.have.callCount(1)
      expect(crispService.crisp.set).to.have.been.calledWithExactly('user:nickname', `${account.firstName} ${account.lastName}`)
      expect(initSpy).to.have.callCount(0)
    })
  })
})
