import React from 'react'
import { storiesOf } from '@kadira/storybook'

// component to story
import Organisation from './Organisation.component'

storiesOf('Organisation', module)
  .add('defaut', () => (
    <Organisation
      id="OrganisationId"
      name="OrganisationName"
      onSelectOrganisation={ () => {} }
      projectConfigsNumber={ 4 }
      usersNumber={ 12 }
    />
  ))
  .add('selected', () => (
    <Organisation
      id="OrganisationId"
      name="OrganisationName"
      onSelectOrganisation={ () => {} }
      projectConfigsNumber={ 40 }
      selected
      usersNumber={ 12 }
    />
  ))
