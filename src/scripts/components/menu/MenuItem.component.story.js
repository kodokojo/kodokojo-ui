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

import React from 'react'
import { IntlProvider } from 'react-intl'
import { storiesOf, linkTo } from '@kadira/storybook'

// contexte
import configureStore from '../../store/configureStore'
import en from '../../i18n/en'

// component to story
import MenuItem from './MenuItem.component'

const initialState = {}
const store = configureStore(initialState)

storiesOf('MenuItem', module)
  .addDecorator((story) => (
    <IntlProvider locale="en" messages={ en } store={ store }>
      <div style={{ width: '200px' }}>
        { story() }
      </div>
    </IntlProvider>
  ))
  .add('menu 0', () => (
    <MenuItem
      index={ 0 }
      labelKey="stacks-label"
      level={ 0 }
      onClick={ linkTo('MenuItem', 'menu 0 - active') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 0 - active', () => (
    <MenuItem
      active
      index={ 0 }
      labelKey="stacks-label"
      level={ 0 }
      onClick={ linkTo('MenuItem', 'menu 0') }
      titleKey="stacks-label"
    />
  ))
  .add('menu default - (text label & title)', () => (
    <MenuItem
      disabled
      index={ 1 }
      labelText="Kodo Kojo"
      route={ '#1' }
      titleText="Kodo Kojo"
    />
  ))
  .add('menu 1 - (3)', () => (
    <MenuItem
      index={ 2 }
      labelKey="stacks-label"
      level={ 1 }
      number={ 3 }
      onClick={ linkTo('MenuItem', 'menu 1 - (3) - active') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 1 - (3) - active', () => (
    <MenuItem
      active
      index={ 2 }
      labelKey="stacks-label"
      level={ 1 }
      number={ 3 }
      onClick={ linkTo('MenuItem', 'menu 1 - (3)') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 2 - (2)', () => (
    <MenuItem
      index={ 2 }
      labelKey="stacks-label"
      level={ 2 }
      number={ 2 }
      onClick={ linkTo('MenuItem', 'menu 2 - (2) - active') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 2 - (2) - active', () => (
    <MenuItem
      active
      index={ 3 }
      labelKey="stacks-label"
      level={ 2 }
      number={ 2 }
      onClick={ linkTo('MenuItem', 'menu 2 - (2)') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 3', () => (
    <MenuItem
      index={ 3 }
      labelKey="stacks-label"
      level={ 3 }
      onClick={ linkTo('MenuItem', 'menu 3 - active') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 3 - active', () => (
    <MenuItem
      active
      index={ 4 }
      labelKey="stacks-label"
      level={ 3 }
      onClick={ linkTo('MenuItem', 'menu 3') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 4', () => (
    <MenuItem
      index={ 4 }
      labelKey="stacks-label"
      level={ 4 }
      onClick={ linkTo('MenuItem', 'menu 4 - active') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 4 - active', () => (
    <MenuItem
      active
      index={ 5 }
      labelKey="stacks-label"
      level={ 4 }
      onClick={ linkTo('MenuItem', 'menu 4') }
      titleKey="stacks-label"
    />
  ))
  .add('menu 2 - disabled', () => (
    <MenuItem
      disabled
      index={ 6 }
      labelKey="stacks-label"
      level={ 2 }
      titleKey="stacks-label"
    />
  ))
