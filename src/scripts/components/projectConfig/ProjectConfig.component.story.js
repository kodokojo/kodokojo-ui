import React from 'react'
import { storiesOf, linkTo } from '@kadira/storybook'
import { IntlProvider } from 'react-intl'

// contexte
import en from '../../i18n/en'

// component to story
import ProjectConfig from './ProjectConfig.component'

storiesOf('ProjectConfig', module)
  .add('defaut', () => (
    <IntlProvider locale="en" messages={ en }>
      <ProjectConfig
        id="ProjectConfigId"
        name="ProjectName"
        status={ 'RUNNING' }
        usersNumber={ 12 }
      />
    </IntlProvider>
  ))
