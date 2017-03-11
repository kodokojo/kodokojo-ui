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

import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(chaiEnzyme())
chai.use(sinonChai)
import { getIntlPropsMock } from '../../../../test/helpers'

// contexte
import { IntlProvider } from 'react-intl'

// component
import { User } from './User.component'
import userTheme from './user.scss'

describe('<User> component', () => {
  let props
  let intlProvider

  beforeEach(() => {
    props = {
      // component
      ...{
        theme: userTheme,
        onUserEdit: () => {},
        onUserSelect: () => {}
      },
      // intl
      ...getIntlPropsMock()
    }
    intlProvider = new IntlProvider({ locale: 'en' }, {})
  })

  it('should init state', () => {
    // Given
    const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <User {...props}/>,
      { context }
    )

    // Then
    expect(component.state().checked).to.be.false
    expect(component.state().edited).to.be.false
    expect(component.find('Checkbox').length).to.equal(1)
    expect(component.find('IconButton').length).to.equal(1)
  })

  it('should init state with checked prop', () => {
    // Given
    const nextProps = {
      ...props,
      ...{
        checked: true
      }
    }
    const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <User {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.state('checked').to.be.true
    expect(component).to.have.state('edited').to.be.false
  })

  it('should disable checkbox and input if disabled prop', () => {
    // Given
    const nextProps = {
      ...props,
      ...{
        disabled: true
      }
    }
    const { context } = intlProvider.getChildContext()

    // When
    const component = mount(
      <User {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.prop('disabled').to.be.true
    expect(component.find('input')).to.have.attr('disabled')
    expect(component.find('button')).to.have.attr('disabled')
  })

  it('should disable checkbox on current connected user', () => {
    // Given
    const nextProps = {
      ...props,
      ...{
        userId: '1',
        userIdConnected: '1'
      }
    }
    const { context } = intlProvider.getChildContext()

    // When
    const component = mount(
      <User {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.prop('disabled').to.be.false
    expect(component.find('input')).to.have.attr('disabled')
    expect(component.find('button')).to.not.have.attr('disabled')
  })

  it('should disable button on not current connected user', () => {
    // Given
    const nextProps = {
      ...props,
      ...{
        userId: '1',
        userIdConnected: '2'
      }
    }
    const { context } = intlProvider.getChildContext()

    // When
    const component = mount(
      <User {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.prop('disabled').to.be.false
    expect(component.find('input')).to.not.have.attr('disabled')
    expect(component.find('button')).to.have.attr('disabled')
  })

  it('should handle select user', () => {
    // Given
    const onUserSelectSpy = sinon.spy()
    const nextProps = {
      ...props,
      ...{
        onUserSelect: onUserSelectSpy,
        userId: '1'
      }
    }
    const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <User {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.state('checked').to.be.false
    component.find('Checkbox').simulate('change')
    expect(component).to.have.state('checked').to.be.true
    expect(onUserSelectSpy).to.have.callCount(1)
    expect(onUserSelectSpy).to.have.been.calledWith({
      '1': {
        checked: true,
        edited: false
      }
    })
  })

  it('should handle edit user', () => {
    // Given
    const onUserEditSpy = sinon.spy()
    const nextProps = {
      ...props,
      ...{
        onUserEdit: onUserEditSpy,
        userId: '1'
      }
    }
    const { context } = intlProvider.getChildContext()

    // When
    const component = shallow(
      <User {...nextProps}/>,
      { context }
    )

    // Then
    expect(component).to.have.state('edited').to.be.false
    component.find('IconButton').simulate('click')
    expect(component).to.have.state('edited').to.be.true
    expect(onUserEditSpy).to.have.callCount(1)
    expect(onUserEditSpy).to.have.been.calledWith({
      '1': {
        checked: false,
        edited: true
      }
    })
  })

})
