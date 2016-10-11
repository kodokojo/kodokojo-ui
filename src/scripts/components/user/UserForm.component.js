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
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm, SubmissionError, propTypes } from 'redux-form'
import { combineValidators, matchesField } from 'revalidate'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'
import classNames from 'classnames'

// Component
import '../../../styles/_commons.less'
import userTheme from '../user/user.scss'
import Avatar from '../_ui/avatar/Avatar.component'
import Button from '../_ui/button/Button.component'
import Input from '../_ui/input/Input.component'
import IconButton from '../_ui/button/IconButton.component'
import CloseIcon from '../_ui/icons/CloseIcon.component'
import { 
  alphabeticRequiredvalidator,
  emailValidator,
  passwordValidator,
  sshkeyValidator
} from '../../services/validator.service'
import { returnErrorKey } from '../../services/error.service'
import { getUser } from '../../commons/reducers'

// validate function
const validate = (values, props) => {
  if (props.creation) {
    return combineValidators({
      email: emailValidator('email')
    })(values)
  }
  if (props.edition) {
    return combineValidators({
      email: emailValidator('email'),
      firstName: alphabeticRequiredvalidator('firstName'),
      lastName: alphabeticRequiredvalidator('lastName'),
      password: passwordValidator('password', 'passwordConfirm'),
      passwordConfirm: matchesField('password')({ message: 'password-confirm-error' }),
      sshKeyPublic: sshkeyValidator('sshKeyPublic')
    })(values)
  }
  return {}
}

// TODO UT
// UserForm component
export class UserForm extends React.Component {

  static propTypes = {
    addUserToProjectConfig: React.PropTypes.func,
    aggregatedStackStatus: React.PropTypes.object,
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
    onUserSelect: React.PropTypes.func.isRequired,
    projectConfigId: React.PropTypes.string,
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
      edited: true
    }
  }

  handleUserSelect = () => {
    const { userId, onUserSelect } = this.props // eslint-disable-line no-shadow
    this.setState({
      ...this.state,
      checked: !this.state.checked
    })
    onUserSelect({
      [userId]: {
        checked: !this.state.checked,
        edited: true
      }
    })
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

  handleUserEditSubmit = ({email, firstName, lastName, password, sshKeyPublic}) => {
    const {
      userId, onSubmitUserForm, onSubmitUserSuccess, onSubmitUserFailure
    } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl // eslint-disable-line no-shadow 

    const nextEmail = email ? email.trim() : ''

    return onSubmitUserForm(nextEmail)
      .then(() => {
        return Promise.resolve(onSubmitUserSuccess(userId))
      })
      .catch(err => {
        onSubmitUserFailure(userId)
        const errorMessageId = returnErrorKey(
          {
            component: 'email',
            code: err.message
          })
        throw new SubmissionError(formatMessage({ id: errorMessageId }, { fieldName: formatMessage({ id: 'email-input-label' }) }))
      })
  }

  render() {
    const {
      email, firstName, lastName, userName, password, sshKeyPublic,
      disabled, handleSubmit, pristine, reset, submitting, edition, creation, user
    } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

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
                  { user &&
                    user.firstName.substr(0, 1).toUpperCase()
                  }
                  { user &&
                    user.lastName.substr(0, 1).toUpperCase()
                  }
                </div>
              </Avatar>
              <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'flex-start', width: '100%' }}>
                <Field
                  component={ Input }
                  disabled={ creation }
                  errorKey="firstname-input-label"
                  label={ formatMessage({ id: 'name-first-label' }) }
                  name="firstName"
                  required={ edition }
                  type="text"
                />
                <Field
                  component={ Input }
                  disabled={ creation }
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
              { /* TODO change this by a dropdown */ }
              <span
                style={{ display: 'flex', flex: '1 1 auto', position: 'relative', height: '50px', justifyContent: 'left', color: '#75757F' }}>
                admin
              </span>
            </div>
            <div className={ userTheme['user-email--form'] }>
              <Field
                component={ Input }
                errorKey="email-input-label"
                hint={ formatMessage({ id: 'email-hint-label' }) }
                label={ formatMessage({ id: 'email-label' }) }
                name="email"
                required
                type="email"
              />
            </div>
            <div className={ userTheme['user-select--form']}>
            </div>
            <div className={ userTheme['user-edit--form']}>
              <IconButton
                className="iconButton"
                disabled={ disabled }
                icon={ <CloseIcon/> }
                onMouseUp={ this.handleUserEditCancel }
              />
            </div>
          </div>
        </div>
        { edition &&
          <div className={ userTheme['user-miscellaneous']}>
            <div className={ userTheme['user-sshkey--form'] }>
              <Field
                component={ Input }
                errorKey="sshkey-public-input-label"
                label={ formatMessage({ id: 'sshkey-public-label' }) }
                multiline
                name="sshKeyPublic"
                required
                type="sshKeyPublic"
              />
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
  const user = getUser(ownProps.userId, state)
  return {
    user,
    initialValues: {
      firstName: user ? user.firstName : '',
      lastName: user ? user.lastName : '',
      userName: user ? user.userName : '',
      email: user ? user.email : '',
      sshKeyPublic: user ? user.sshKeyPublic : ''
    }
  }
}

const UserFormContainer = compose(
  connect(
    mapStateProps,
    {}
  ),
  injectIntl
)(reduxForm(
  {
    touchOnChange: true,
    validate
  }
)(UserForm))

export default UserFormContainer
