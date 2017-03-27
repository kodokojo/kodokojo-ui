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
import { connect } from 'react-redux'
import { compose } from 'redux'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'
import sortBy from 'lodash/sortBy'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import utilsTheme from 'kodokojo-ui-commons/src/styles/_utils.scss'
import Page from 'kodokojo-ui-commons/src/scripts/components/page/Page.component'
import Paragraph from 'kodokojo-ui-commons/src/scripts/components/page/Paragraph.component'

// Component
import organisationTheme from '../components/organisation/organisation.scss'
import OrganisationAddButton from '../components/organisation/OrganisationAddButton.component'
import OrganisationForm from '../components/organisation/OrganisationForm.component'
import Organisation from '../components/organisation/Organisation.component'
import { setNavVisibility } from '../components/app/app.actions'
import { createOrganisation, getOrganisationList, updateOrganisation } from '../components/organisation/organisation.actions'


export class OrganisationsPage extends React.Component {

  static propTypes = {
    createOrganisation: React.PropTypes.func,
    getOrganisationList: React.PropTypes.func,
    intl: intlShape.isRequired,
    isFetching: React.PropTypes.bool,
    organisationId: React.PropTypes.string,
    organisations: React.PropTypes.object,
    setNavVisibility: React.PropTypes.func.isRequired,
    updateOrganisation: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isOrganisationFormAddActive: false
    }
  }

  componentWillMount = () => {
    const { getOrganisationList } = this.props // eslint-disable-line no-shadow

    this.initNav()

    getOrganisationList()
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(true)
  }

  handleToggleOrganisationAdd = () => {
    this.setState({
      isOrganisationFormAddActive: !this.state.isOrganisationFormAddActive
    })
  }

  handleAddOrganisation = (name) => {
    const { createOrganisation } = this.props

    return createOrganisation(name)
  }

  handleSelectOrganisation = (organisationId) => {
    const { updateOrganisation } = this.props

    return updateOrganisation(organisationId)
  }

  render() {
    const { isFetching, organisationId, organisations } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    return (
      <Page>
        <h1 className={ utilsTheme['secondary-color--1'] }>
          <FormattedMessage id={'organisations-label'} />
        </h1>
        <Paragraph>
          <div className={ organisationTheme['organisation-container'] }>
          { !this.state.isOrganisationFormAddActive &&
            <OrganisationAddButton
              label={ formatMessage({ id: 'organisation-add-label' }) }
              onToggleForm={ () => this.handleToggleOrganisationAdd() }
              title={ formatMessage({ id: 'organisation-add-title-label' }) }
            />
          }
          { this.state.isOrganisationFormAddActive &&
            <OrganisationForm
              disabled={ isFetching }
              onCancelAddOrganisation={ () => this.handleToggleOrganisationAdd() }
              onSubmitOrganisationFailure={ () => {} }
              onSubmitOrganisationForm={ (name) => this.handleAddOrganisation(name) }
              onSubmitOrganisationSuccess={ () => this.handleToggleOrganisationAdd() }
            />
          }
          { organisations &&
            sortBy(organisations, [organisation => {
              return organisation.name.toLocaleLowerCase()
            }])
              .map(organisation => (
                <Organisation
                  id={ organisation.id }
                  key={ organisation.id }
                  name={ organisation.name }
                  onSelectOrganisation={ (organisationId) => this.handleSelectOrganisation(organisationId) }
                  selected={ organisationId === organisation.id }
                />
            ))
          }
          </div>
        </Paragraph>
      </Page>
    )
  }
}

// OrganisationsPage container
const mapStateProps = (state, ownProps) => (
  {
    location: ownProps.location,
    organisationId: state.context.organisation.id,
    organisations: state.organisation.list,
    isFetching: state.organisation.isFetching
  }
)

const OrganisationsPageContainer = compose(
  connect(
    mapStateProps,
    {
      createOrganisation,
      getOrganisationList,
      setNavVisibility,
      updateOrganisation
    }
  ),
  injectIntl
)(OrganisationsPage)


export default OrganisationsPageContainer
