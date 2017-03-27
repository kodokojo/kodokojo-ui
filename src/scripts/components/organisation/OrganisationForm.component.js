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
import { Field, reduxForm, SubmissionError, propTypes } from 'redux-form'
import { intlShape, injectIntl} from 'react-intl'

// Component commons
import organisationTheme from './organisation.scss'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'
import IconButton from 'kodokojo-ui-commons/src/scripts/components/button/IconButton.component'
import Input from 'kodokojo-ui-commons/src/scripts/components/input/Input.component'
import CloseIcon from 'kodokojo-ui-commons/src/scripts/components/icons/CloseIcon.component'
import { returnErrorKey } from '../../services/error.service'


// Component
export class OrganisationForm extends React.Component {

  static propTypes = {
    disabled: React.PropTypes.bool,
    intl: intlShape.isRequired,
    onCancelAddOrganisation: React.PropTypes.func,
    onSubmitOrganisationFailure: React.PropTypes.func.isRequired,
    onSubmitOrganisationForm: React.PropTypes.func.isRequired,
    onSubmitOrganisationSuccess: React.PropTypes.func.isRequired,
    ...propTypes
  }

  static defaultProps = {
    disabled: false
  }

  handleAddOrganisationSubmit = ({ name }) => {
    const { onSubmitOrganisationForm, onSubmitOrganisationSuccess, onSubmitOrganisationFailure } = this.props

    return onSubmitOrganisationForm(name)
      .then(() => {
        return Promise.resolve(onSubmitOrganisationSuccess(name))
      })
      .catch(err => {
        onSubmitOrganisationFailure(name)
        throw new SubmissionError(
          { name: returnErrorKey(
            {
              component: 'organisation',
              code: err.message
            })
          }
        )
      })
  }
  handleCancelAddOrganisation = () => {
    const { onCancelAddOrganisation } = this.props

    onCancelAddOrganisation()
  }

  render() {
    const { disabled, handleSubmit } = this.props
    const { formatMessage } = this.props.intl

    return (
      <form
        className={ organisationTheme['organisation-container--form'] }
        name="organisationForm"
        noValidate
        onSubmit={ handleSubmit(this.handleAddOrganisationSubmit) }
      >
        <div className={ organisationTheme['organisation-form'] }>
          <Field
            component={ Input }
            disabled={ disabled }
            label={ formatMessage({ id: 'name-label' }) }
            name="name"
            required
            type="text"
          />
          <IconButton
            className="iconButton"
            icon={ <CloseIcon/> }
            onMouseUp={ this.handleCancelAddOrganisation }
            style={{ width: '80px' }}
          />
        </div>
        <div className={ organisationTheme['organisation-actions'] }>
          <Button
            disabled={ disabled }
            label={ formatMessage({ id: 'add-label' }) }
          />
        </div>
      </form>
    )
  }

}

// OrganisationForm container

const OrganisationFormContainer = compose(
  injectIntl
)(reduxForm(
  {
    form: 'organisationForm',
    touchOnChange: true,
    // validate
  }
)(OrganisationForm))

export default OrganisationFormContainer