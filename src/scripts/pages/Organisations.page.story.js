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
import { storiesOf, linkTo } from '@kadira/storybook'

// contexte
import configureStore from '../store/configureStore'
import en from '../i18n/en'

// component to story
import App from '../components/app/App.component'
import OrganisationsPage from './Organisations.page'

const initialState = {
  auth: {
    account: {
      id: 'RootUserId',
      userName: 'root',
      group: 'ROOT',
      token: 'RootToken'
    },
    captcha: {
      value: '',
      reset: false
    },
    isAuthenticated: true,
    isFetching: false
  },
  breadcrumb: [
    {
      route: '/organisations',
      root: true,
      labelKey: 'organisations-label',
      titleKey: 'organisations-label',
      disabled: true
    }
  ],
  bricks: {
    list: [],
    isFetching: false
  },
  context: {
    user: {
      id: 'b9a7bb60b67dbfa08c95b44f5',
      group: 'ROOT'
    },
    organisation: {
      id: '07cf31e60e27c025a31b4db9d011',
      name: 'root'
    },
    projectConfig: {
      name: 'MyProject'
    },
    project: {}
  },
  menu: [
    {
      labelKey: 'organisations-label',
      level: 0,
      route: '/organisations',
      titleText: 'organisations-title-label',
      active: true
    },
    {
      disabled: true,
      labelKey: 'projects-label',
      level: 0,
      route: '#projects',
      titleText: 'disabled because projects page does not exist'
    }
  ],
  organisation: {
    list: {
      '07cf31e60e27c025a31b4db9d0118a77a0cd1008': {
        id: '07cf31e60e27c025a31b4db9d0118a77a0cd1008',
        name: 'root'
      },
      'g456f31e60e27c025a31b4db9d0118a77a0cd1008': {
        id: 'g456f31e60e27c025a31b4db9d0118a77a0cd1008',
        name: 'OtherOrganisation'
      },
      'q456f31e60e27c025a31b4db9d0118a77a0cd1008': {
        id: 'q456f31e60e27c025a31b4db9d0118a77a0cd1008',
        name: 'ThirdOrga'
      }
    },
    isFetching: false
  },
  prefs: {
    theme: 'dark',
    locale: 'en',
    navigation: true,
    version: {
      api: {
        version: '1.0-SNAPSHOT',
        branch: 'master',
        commit: '47275f5569cd64b2e2453080da97116ec58b8ac2'
      },
      ui: {
        version: '1.1.0',
        branch: 'master',
        commit: '91a1ff36a98895877b5bea60ff404ca52a01e65b'
      }
    },
    isFetching: false,
    configuration: {
      ui: {
        CRISP: '',
        HELP_EMAIL: 'help@kodokojo.io',
        RECAPTCHA: '',
        TOS: '',
        WAITING_LIST: '',
        SIGNUP: 'true'
      }
    }
  }
}

const storeInitial = configureStore(initialState)

storiesOf('OrganisationsPage', module)
  .add('with 2 users - disabled', () => (
    <Provider store={storeInitial}>
      <IntlProvider locale="en" messages={ en }>
        <App>
          <OrganisationsPage
            location={ location }
          />
        </App>
      </IntlProvider>
    </Provider>
  ))
