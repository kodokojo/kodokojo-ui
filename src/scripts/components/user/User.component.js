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
import capitalise from 'lodash/capitalize'
import { themr } from 'react-css-themr'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'

// Component
import { USER } from '../../commons/identifiers'
import '../../../styles/_commons.less'
import userTheme from './user.scss'
import Avatar from '../_ui/avatar/Avatar.component'
import Checkbox from '../_ui/checkbox/Checkbox.component'
import IconButton from '../_ui/button/IconButton.component'
import EditIcon from '../_ui/icons/EditIcon.component'
import { getUser } from '../../commons/reducers'

// TODO UT
// User component
export class User extends React.Component {

  static propTypes = {
    checked: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    intl: intlShape.isRequired,
    onUserEdit: React.PropTypes.func.isRequired,
    onUserSelect: React.PropTypes.func.isRequired,
    theme: React.PropTypes.object,
    user: React.PropTypes.object,
    userId: React.PropTypes.string
  }

  static defaultProps = {
    disabled: false
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.checked || false,
      edited: false
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
        edited: false
      }
    })
  }

  handleUserEdit = () => {
    const { userId, onUserEdit } = this.props // eslint-disable-line no-shadow
    this.setState({
      ...this.state,
      edited: true
    })
    onUserEdit({
      [userId]: {
        checked: this.state.checked,
        edited: true
      }
    })
  }

  render() {
    const { disabled, user, theme } = this.props // eslint-disable-line no-shadow
    // const { formatMessage } = this.props.intl

    const userClasses = classNames(theme.user, theme['user-item'], {
      [userTheme['user-item--disabled']]: disabled
    })

    return (
      <div className={ userClasses }>
        <div className={ theme['user-container'] }>
          <div className={ theme['user-name'] }>
            <Avatar>
              <div className={ theme['user-initials'] }>
                { user &&
                  user.firstName.substr(0, 1).toUpperCase()
                }
                { user &&
                  user.lastName.substr(0, 1).toUpperCase()
                }
              </div>
            </Avatar>
            { user &&
            `${capitalise(user.firstName)} ${capitalise(user.lastName)}`
            }
          </div>
          <div className={ theme['user-username'] }>
            { user ? user.userName : '-' }
          </div>
          <div className={ theme['user-group'] }>
            { user ? 'admin' : '-' }
          </div>
          <div className={ theme['user-email'] }>
            { user ? user.email : '-' }
          </div>
          <div className={ theme['user-select'] }>
            <Checkbox
              checked={ this.state.checked }
              disabled={ disabled }
              onChange={ this.handleUserSelect }
            />
          </div>
          <div className={ theme['user-edit'] }>
            <IconButton
              disabled={ disabled }
              icon={ <EditIcon/> }
              onClick={ this.handleUserEdit }
            />
          </div>
        </div>
      </div>
    )
  }
}

// User container
const mapStateProps = (state, ownProps) => (
  {
    user: getUser(ownProps.userId, state)
  }
)

const UserContainer = themr(USER, userTheme)(compose(
  connect(
    mapStateProps,
    {}
  ),
  injectIntl
)(User))

export default UserContainer
