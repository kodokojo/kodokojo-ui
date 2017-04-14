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
import { change, Field, reduxForm, SubmissionError, propTypes } from 'redux-form'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import Avatar from 'kodokojo-ui-commons/src/scripts/components/avatar/Avatar.component'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'
import Input from 'kodokojo-ui-commons/src/scripts/components/input/Input.component'
import IconButton from 'kodokojo-ui-commons/src/scripts/components/button/IconButton.component'
import Dropdown from 'kodokojo-ui-commons/src/scripts/components/dropdown/Dropdown.component'
import DropdownItemDefault from 'kodokojo-ui-commons/src/scripts/components/dropdown/DropdownItem.component'
import CloseIcon from 'kodokojo-ui-commons/src/scripts/components/icons/CloseIcon.component'

// Component
import userValidator from './user.validator'
import userTheme from './user.scss'
import { getGroups } from '../../services/param.service'
import { returnErrorKey } from '../../services/error.service'
import { getUserFromId } from '../../commons/reducers'

// validate function
const validate = userValidator

// TODO UT
// UserForm component
export class UserForm extends React.Component {

  static propTypes = {
    aggregatedStackStatus: React.PropTypes.object,
    change: React.PropTypes.func,
    checked: React.PropTypes.bool,
    creation: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    edition: React.PropTypes.bool,
    intl: intlShape.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSubmitUserFailure: React.PropTypes.func.isRequired,
    onSubmitUserForm: React.PropTypes.func.isRequired,
    onSubmitUserSuccess: React.PropTypes.func.isRequired,
    onUserEditCancel: React.PropTypes.func.isRequired,
    organisationId: React.PropTypes.string,
    theme: React.PropTypes.object,
    user: React.PropTypes.object,
    userId: React.PropTypes.string,
    ...propTypes
  }

  static defaultProps = {
    creation: false,
    edition: false
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.checked || false,
      edited: true,
      group: undefined
    }
  }

  handleGroupChange = (value) => {
    const { change, formValues } = this.props
    this.setState({
      group: value
    })
    change('group', value)
  }

  handleUserEditCancel = () => {
    const { userId, onCancel, onUserEditCancel, reset } = this.props
    this.setState({
      ...this.state,
      edited: false
    })
    onUserEditCancel({
      [userId]: {
        checked: this.state.checked,
        edited: false
      }
    })

    onCancel(userId)
    reset()
  }

  handleUserEditSubmit = ({email, firstName, lastName, group, password, sshKeyPublic}) => {
    const {
      user, organisationId, onSubmitUserForm, onSubmitUserSuccess, onSubmitUserFailure
    } = this.props // eslint-disable-line no-shadow

    const nextUser = {
      id: user ? user.id : '',
      email: email ? email.trim() : '',
      firstName: firstName ? firstName.trim() : '',
      lastName: lastName ? lastName.trim() : '',
      password: password ? password.trim() : '',
      sshKeyPublic: sshKeyPublic ? sshKeyPublic.trim() : '',
      group,
      organisationId
    }

    return onSubmitUserForm(nextUser)
      .then(() => {
        return Promise.resolve(onSubmitUserSuccess(nextUser))
      })
      .catch(err => {
        onSubmitUserFailure(nextUser)
        throw new SubmissionError(
          { email: returnErrorKey(
            {
              component: 'email',
              code: err.message
            })
          }
        )
      })
  }

  render() {
    const {
      disabled, handleSubmit, pristine, reset, submitting, edition, creation,
      user, userGroup
    } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl
    const groups = getGroups(userGroup).map(group => {
      if (group.labelKey) {
        group.labelText = formatMessage({ id: group.labelKey })
      }
      return group
    })

    return (
      <form
        className={ userTheme['user-container--form'] }
        id="userForm"
        name="userForm"
        noValidate
        onSubmit={ handleSubmit(this.handleUserEditSubmit) }
      >
        <div className={ userTheme['user-form']}>
          <div className={ classNames(userTheme.user, userTheme['user-item--form']) }>
            <div className={ userTheme['user-name--form'] }>
              <Avatar>
                <div className={ userTheme['user-initials'] }>
                  { user && user.firstName &&
                    user.firstName.substr(0, 1).toUpperCase()
                  }
                  { user && user.lastName &&
                    user.lastName.substr(0, 1).toUpperCase()
                  }
                </div>
              </Avatar>
              <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'flex-start', width: '100%' }}>
                <Field
                  component={ Input }
                  disabled={ creation || submitting }
                  errorKey="firstname-input-label"
                  label={ formatMessage({ id: 'name-first-label' }) }
                  name="firstName"
                  required={ edition }
                  type="text"
                />
                <Field
                  component={ Input }
                  disabled={ creation || submitting }
                  errorKey="lastname-input-label"
                  label={ formatMessage({ id: 'name-last-label' }) }
                  name="lastName"
                  required={ edition }
                  type="text"
                />
              </div>
            </div>
            <div className={ userTheme['user-username--form'] }>
              <Field
                component={ Input }
                disabled
                label={ formatMessage({ id: 'username-label' }) }
                name="userName"
                required={ edition }
                type="text"
              />
            </div>
            <div className={ userTheme['user-group--form'] }>
              <div style={{ display: 'flex', flex: '1 1 auto', marginTop: '-28px', marginRight: '7px' }}>
                <Field
                  component={ Dropdown }
                  disabled={ submitting }
                  id="group"
                  name="group"
                  props={{
                    disabled: (userGroup === 'USER'),
                    onChange: this.handleGroupChange,
                    required: true,
                    source: groups,
                    template: DropdownItemDefault,
                    value: (this.state.group || groups[0].value)
                  }}
                  type="text"
                />
              </div>
            </div>
            <div className={ userTheme['user-email--form'] }>
              <Field
                component={ Input }
                disabled={ submitting }
                errorKey="email-input-label"
                hint={ formatMessage({ id: 'email-hint-label' }) }
                label={ formatMessage({ id: 'email-label' }) }
                name="email"
                required
                type="email"
              />
            </div>
            <div className={ userTheme['user-select--form']}/>
            <div className={ userTheme['user-edit--form']}>
              <IconButton
                className="iconButton"
                disabled={ disabled || submitting }
                icon={ <CloseIcon/> }
                onMouseUp={ this.handleUserEditCancel }
              />
            </div>
          </div>
        </div>
        { edition &&
          <div className={ userTheme['user-miscellaneous'] }>
            <div className={ userTheme['user-sshkey--form'] }>
              <Field
                component={ Input }
                disabled={ submitting }
                errorKey="sshkey-public-input-label"
                label={ formatMessage({ id: 'sshkey-public-label' }) }
                multiline
                name="sshKeyPublic"
                rows={ 4 }
                style={{ maxHeight: '104px' }}
              />
            </div>
            <div className={ userTheme['user-password--form'] }>
              <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'flex-start', width: '100%' }}>
                <Field
                  component={ Input }
                  disabled={ submitting }
                  label={ formatMessage({ id: 'password-label' }) }
                  name="password"
                  type="password"
                />
                <Field
                  component={ Input }
                  disabled={ submitting }
                  label={ formatMessage({ id: 'password-confirm-label' }) }
                  name="passwordConfirm"
                  type="password"
                />
              </div>
            </div>
          </div>
        }
        <div className={ userTheme['user-actions'] }>
          <Button
            disabled={ submitting || disabled }
            label={ formatMessage({ id: 'cancel-label' })}
            onMouseUp={ this.handleUserEditCancel }
          />
          <Button
            disabled={ submitting || disabled }
            label={ formatMessage({ id: 'save-label' })}
            primary
            type="submit"
          />
        </div>
      </form>
    )
  }
}

// UserForm container
const mapStateProps = (state, ownProps) => {
  const user = getUserFromId(ownProps.userId, state)
  const groups = getGroups(state.context.user.group)
  return {
    user,
    userGroup: state.context.user.group,
    organisationId: state.context.organisation.id,
    initialValues: {
      firstName: user ? user.firstName : '',
      lastName: user ? user.lastName : '',
      userName: user ? user.userName : '',
      email: user ? user.email : '',
      sshKeyPublic: user ? user.sshKeyPublic : '',
      group: groups ? groups[0].value : 'USER'
    }
  }
}

const UserFormContainer = compose(
  connect(
    mapStateProps,
    {
      change
    }
  ),
  injectIntl
)(reduxForm(
  {
    form: 'userForm',
    touchOnChange: true,
    validate
  }
)(UserForm))

export default UserFormContainer
