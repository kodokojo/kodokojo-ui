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
import { storiesOf, action } from '@kadira/storybook'

// contexte
import en from '../../i18n/en'

// component to story
import Brick from './Brick.component'

const brickRunning = {
  type: 'type',
  name: 'name',
  state: 'RUNNING',
  version: '2.1.2',
  url: '#entity-type-linktobrick.kodokojo.io'
}
const brickStarting = {
  type: 'type',
  name: 'name',
  state: 'STARTING',
  version: '2.1.2',
  url: ''
}
const brickFailure = {
  type: 'type',
  name: 'name',
  state: 'ONFAILURE',
  version: '2.1.2',
  url: '#entity-type-linktobrick.kodokojo.io'
}
const brickDefault = {
  type: 'type',
  name: 'name',
  state: undefined,
  version: '2.1.2',
  url: '#entity-type-linktobrick.kodokojo.io'
}

storiesOf('Brick', module)
  .addDecorator((story) => (
    <IntlProvider locale="en" messages={ en } >
      { story() }
    </IntlProvider>
  ))
  .add('running', () => (
    <Brick
      brick={ brickRunning }
    />
  ))
  .add('starting', () => (
    <Brick
      brick={ brickStarting }
    />
  ))
  .add('failure', () => (
    <Brick
      brick={ brickFailure }
    />
  ))
  .add('default', () => (
    <Brick
      brick={ brickDefault }
    />
  ))
