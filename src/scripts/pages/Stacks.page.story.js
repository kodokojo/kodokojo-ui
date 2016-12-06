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

import React from 'react'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { storiesOf, linkTo } from '@kadira/storybook'
import merge from 'lodash/merge'

// contexte
import configureStore from '../store/configureStore'
import en from '../i18n/en'

// component to story
import App from '../components/app/App.component'
import StacksPage from './Stacks.page'

const initialState = {
  auth: {
    isAuthenticated: true
  },
  prefs: {
    navigation: false,
    locale: 'en',
    theme: 'dark',
    version: {
      api: {
        version: '1.1.0',
        branch: 'styleguide',
        commit: '26e77589fed6eb62f146dc9332c80614a0f49f40'
      },
      ui: {
        version: '1.1.0',
        branch: 'styleguide',
        commit: '26e77589fed6eb62f146dc9332c80614a0f49f40'
      }
    }
  },
  menu: {
    0: {
      index: 0,
      labelKey: 'projects-label',
      level: 0,
      route: '#projects',
      titleKey: 'projects-label'
    },
    1: {
      index: 1,
      disabled: true,
      labelText: 'Kodo Kojo',
      titleText: 'Kodo Kojo'
    },
    2: {
      active: true,
      index: 2,
      labelKey: 'stacks-label',
      level: 1,
      route: '/stacks',
      titleKey: 'stacks-label'
    },
    3: {
      active: false,
      index: 3,
      labelKey: 'members-label',
      level: 2,
      onClick: linkTo('MembersPage'),
      route: '/members',
      titleKey: 'members-label'
    }
  },
  projectConfig: {
    stacks: [
      {
        bricks: [
          {
            type: 'type',
            name: 'name',
            state: 'RUNNING',
            version: '2.1.2',
            url: '#entity-type-linktobrick.kodokojo.io'
          },
          {
            type: 'type',
            name: 'name',
            state: 'STARTING',
            version: '2.1.2',
            url: ''
          },
          {
            type: 'type',
            name: 'name',
            state: 'ONFAILURE',
            version: '2.1.2',
            url: '#entity-type-linktobrick.kodokojo.io'
          },
          {
            type: 'type',
            name: 'name',
            state: undefined,
            version: '2.1.2',
            url: '#undefined-status'
          }
        ]
      }
    ]
  }
}

const location = {
  pathname: '/stacks'
}

const storeInitial = configureStore(initialState)
const storeWithAlerts = configureStore(merge(
  {},
  initialState,
  {
    alerts: {
      display: {
        id: 2,
        active: true,
        icon: 'question_answer',
        label: 'Some important message 1',
        variant: 'warning'
      },
      list: [
        {
          id: 2,
          active: false,
          icon: 'question_answer',
          label: 'Some important message 1',
          variant: 'warning'
        },
        {
          id: 4,
          active: false,
          icon: 'question_answer',
          label: 'Some important message with timer 4',
          timeout: 1000,
          variant: 'info'
        },
        {
          action:'I understand',
          id: 3,
          active: false,
          icon: 'question_answer',
          label: 'Some important message 3',
          variant: 'accept'
        },
        {
          id: 42,
          active: false,
          icon: 'question_answer',
          label: 'Some important message 42',
          variant: 'accept'
        }
      ]
    }
  }
))

storiesOf('StacksPage', module)
  .add('stack with all 4 status', () => (
    <Provider store={storeInitial}>
      <IntlProvider locale="en" messages={ en }>
        <App>
          <StacksPage
            location={ location }
          />
        </App>
      </IntlProvider>
    </Provider>
  ))
  .add('stack with all 4 status and alerts', () => (
    <Provider store={storeWithAlerts}>
      <IntlProvider locale="en" messages={ en }>
        <App>
          <StacksPage
            location={ location }
          />
        </App>
      </IntlProvider>
    </Provider>
  ))
