import React from 'react'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { storiesOf, linkTo } from '@kadira/storybook'

// contexte
import configureStore from '../store/configureStore'
import en from '../i18n/en'

// component to story
import App from '../components/app/App.component'
import ProjectConfigsPage from './ProjectConfigs.page'

const initialState = {
  alerts: {
    display: {},
    list: []
  },
  auth: {
    account: {
      id: '76152c64cc863572e198185',
      name: 'me user',
      userName: 'MeName',
      email: 'me@kodokojo.io',
      sshKeyPublic: '',
      isRoot: true,
      organisations: [
        {
          id: '7baa5927d905b72ea5336',
          name: 'myOrganisation',
          group: 'ADMIN',
          projectConfigs: [
            {
              id: '07cd3b82b9d720645fa1c028176',
              name: 'NewProject',
              project: {
                id: '4028dab8ee34ec8d0b8f4be5e02adc82d'
              },
              isTeamLeader: true
            },
            {
              id: 'a36c88233ef0b39133d082a198a',
              name: 'SecondProject',
              project: {
                id: '28cf3e934c9cb704b9650dde1575a3'
              },
              isTeamLeader: true
            }
          ]
        }
      ]
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
      labelText: 'myOrganisation',
      titleText: 'myOrganisation',
      route: '',
      type: 'organisation',
      disabled: false
    },
    {
      labelText: 'NewProject',
      titleText: 'NewProject',
      route: '',
      type: 'project',
      disabled: true
    },
    {
      route: '/projects',
      labelKey: 'projects-label',
      titleKey: 'projects-label',
      type: 'menu',
      disabled: true
    }
  ],
  bricks: {
    list: [],
    isFetching: false
  },
  context: {
    user: {
      id: '76152c64cc863572e194284bc9a8cdf',
      name: 'me user',
      group: 'MyName'
    },
    organisation: {
      id: '7baa5927d905b72ea5dd465d31fe81',
      name: 'myOrganisation'
    },
    projectConfig: {
      id: '07cd3b82b9d720645fa8ad0bb5a4',
      name: 'NewProject'
    },
    project: {
      id: '4028dab8ee34ec8d0b8f4b5e02adc82d'
    }
  },
  db: {
    entry: {},
    entries: [],
    isFetching: false
  },
  menu: [
    {
      labelKey: 'organisations-label',
      level: 0,
      route: '/organisations',
      titleKey: 'organisations-title-label'
    },
    {
      labelKey: 'projects-label',
      level: 0,
      route: '/projects',
      titleKey: 'organisations-title-label',
      active: true
    }
  ],
  organisation: {
    list: {},
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
        commit: '40e406920f749641e52307b334936377eea4f85c'
      },
      ui: {
        version: '1.1.0',
        branch: 'master',
        commit: '680edc506432a97b062cbe9634f083744981de7f'
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
  },
  projectConfig: {
    id: '07cd3b82b9d720645fa1c0281764e5f8ad0bb5a4',
    isFetching: false,
    project: {
      id: '4028dab8ee34ec8d0b8f4be133ec9d5e02adc82d'
    }
  },
  event: {
    connected: false,
    isFetching: false
  },
  users: {
    isFetching: false
  },
  form: {},
  routing: {
    locationBeforeTransitions: {
      pathname: '/projects',
      search: '',
      hash: '',
      action: 'POP',
      key: 'nwvwby',
      query: {}
    }
  }
}

const storeInitial = configureStore(initialState)

storiesOf('ProjectConfigsPage', module)
  .add('with 2 project configs', () => (
    <Provider store={storeInitial}>
      <IntlProvider locale="en" messages={ en }>
        <App>
          <ProjectConfigsPage
            location={ location }
          />
        </App>
      </IntlProvider>
    </Provider>
  ))
