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
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { storiesOf, action } from '@kadira/storybook'

// contexte
import configureStore from '../../store/configureStore'
import en from '../../i18n/en'

// component to story
import AppHeader from './AppHeader.component'

const initialState = {}
const store = configureStore(initialState)
const version = {
  api: {
    version: '1.1.0',
    branch: 'dev',
    commit: '26e77589fed6eb62f146dc9332c80614a0f49f40'
  },
  ui: {
    version: '1.1.0',
    branch: 'dev',
    commit: '26e77589fed6eb62f146dc9332c80614a0f49f40'
  }
}

storiesOf('AppHeader', module)
  .addDecorator((story) => (
    <Provider store={ store }>
      <IntlProvider locale="en" messages={ en }>
        { story() }
      </IntlProvider>
    </Provider>
  ))
  .add('authenticated', () => (
    <AppHeader
      isAuthenticated
      onLogout={() => {}}
    />
  ))
  .add('authenticated and version', () => (
    <AppHeader
      isAuthenticated
      onLogout={() => {}}
      version={version}
    />
  ))
