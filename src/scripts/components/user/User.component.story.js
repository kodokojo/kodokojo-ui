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
import User from './User.component'

const initialState = {
  users: {
    1: {
      firstName: 'firstname',
      lastName: 'lastname',
      userName: 'username',
      email: 'username@email.ext'
    }
  }
}

const store = configureStore(initialState)

storiesOf('User', module)
  .add('default', () => (
    <IntlProvider locale="en" messages={ en }>
      <User
        onUserEdit={ () => {} }
        onUserSelect={ () => {} }
        store={store}
        userId={ '1' }
      />
    </IntlProvider>
  ))
