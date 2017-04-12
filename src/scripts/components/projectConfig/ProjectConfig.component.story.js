import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@kadira/storybook'
import { IntlProvider } from 'react-intl'

// contexte
import configureStore from '../../store/configureStore'
import en from '../../i18n/en'

// component to story
import ProjectConfig from './ProjectConfig.component'

const initialState = {
  projectConfig: {
    list: {
      'ProjectConfigId': {
        id: 'ProjectConfigId',
        stacks: [
          {
            bricks: [
              {
                state: 'RUNNING'
              }
            ]
          }
        ]
      }
    }
  }
}

const storeInitial = configureStore(initialState)


storiesOf('ProjectConfig', module)
  .add('defaut', () => (
    <Provider store={storeInitial}>
      <IntlProvider locale="en" messages={ en }>
        <ProjectConfig
          id="ProjectConfigId"
          name="ProjectName"
          status={ 'RUNNING' }
          usersNumber={ 12 }
        />
      </IntlProvider>
    </Provider>
  ))
