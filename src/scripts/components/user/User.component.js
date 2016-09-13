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

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import capitalise from 'lodash/capitalize'
import { themr } from 'react-css-themr'
import classNames from 'classnames'

// Component
import { USER } from '../../commons/identifiers'
import '../../../styles/_commons.less'
import userTheme from './user.scss'
import Avatar from '../_ui/avatar/Avatar.component'
import Checkbox from '../_ui/checkbox/Checkbox.component'

// TODO TU
// User component
export class User extends Component {

  constructor(props) {
    super(props)
    this.state = {
      checked: false
    }
  }

  static propTypes = {
    onSelected: PropTypes.func.isRequired,
    theme: PropTypes.object,
    user: PropTypes.object
  }

  selectUser = () => {
    const { userId, onSelected } = this.props
    this.setState({ checked: !this.state.checked })
    onSelected({
      [userId]: { checked: this.state.checked }
    })
  }

  render() {
    const { user, theme, onSelected } = this.props // eslint-disable-line no-shadow
    const userClasses = classNames(theme.user, theme['user-item'])

    return (
      <div className={ userClasses }>
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
        <div className={ theme['user-selected'] }>
          <Checkbox
            checked={ this.state.checked }
            onChange={ this.selectUser }
          />
        </div>
      </div>
    )
  }
}

// User container
const mapStateProps = (state, ownProps) => (
  {
    users: state.users,
    userId: ownProps.userId
  }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => (
  {
    ...ownProps,
    user: stateProps.users[ownProps.userId]
  }
)

const UserContainer = themr(USER, userTheme)(connect(
  mapStateProps,
  {},
  mergeProps
)(User))

export default UserContainer
