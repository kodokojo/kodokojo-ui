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
import { compose } from 'redux'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'
import classNames from 'classnames'

// Component
import '../../styles/_commons.less'
import utilsTheme from '../../styles/_utils.scss'
import userTheme from '../components/user/user.scss'
import Page from '../components/_ui/page/Page.component'
import Paragraph from '../components/_ui/page/Paragraph.component'
import Action from '../components/_ui/page/Action.component'
import User from '../components/user/User.component'
import UserForm from '../components/user/UserForm.component'
import { setNavVisibility } from '../components/app/app.actions'
import { getProjectConfig } from '../components/projectConfig/projectConfig.actions'
import Button from '../components/_ui/button/Button.component'

// MembersPage component
export class MembersPage extends Component {

  static propTypes = {
    addUserToProjectConfig: PropTypes.func,
    getProjectConfig: PropTypes.func,
    intl: intlShape.isRequired,
    members: PropTypes.array,
    projectConfigId: PropTypes.string,
    setNavVisibility: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isFormActive: false,
      memberList: {}
    }
  }

  componentWillMount() {
    const { getProjectConfig, members, projectConfigId } = this.props // eslint-disable-line no-shadow

    this.initNav()

    if (!members && projectConfigId) {
      getProjectConfig(projectConfigId)
    } else if (!projectConfigId) {
      // TODO no projectConfigId case
    }
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(true)
  }

  handleToggleFormActive = () => {
    // NB this method triggers false react setState warnings on dev mode due to webpack dev server
    // but fortunately, this warnings are not thrown in production mode
    this.setState({
      isFormActive: !this.state.isFormActive
    })
  }

  handleUserSelection = (userState) => {
    this.setState({
      ...this.state,
      memberList: {
        ...this.state.memberList,
        userState
      }
    })
  }

  render() {
    const { members } = this.props
    const userClasses = classNames(userTheme.user, userTheme['user-header'])
    const { formatMessage } = this.props.intl

    return (
      <Page>
        <h1 className={ utilsTheme['secondary-color--2'] }>
          <FormattedMessage id={'members-label'} />
        </h1>
        <Action>
          <UserForm
            formActive={ this.state.isFormActive }
            onToggleFormActive={ this.handleToggleFormActive }
          />
        </Action>
        <Paragraph>
          <div className={ userClasses }>
            <div className={ userTheme['user-name'] }>
              <div className={ userTheme['user-spacer'] }>
              </div>
              <FormattedMessage id={'name-label'} />
            </div>
            <div className={ userTheme['user-username'] }>
              <FormattedMessage id={'username-label'} />
            </div>
            <div className={ userTheme['user-group'] }>
              <FormattedMessage id={'group-label'} />
            </div>
            <div className={ userTheme['user-email'] }>
              <FormattedMessage id={'email-label'} />
            </div>
            <div className={ userTheme['user-delete'] }>
              <FormattedMessage id={'delete-label'} />
            </div>
          </div>
          { members && members.length &&
            members.map((userId, index) => (
              <User
                key={ index }
                userId={ userId }
                onSelected={ this.handleUserSelection }
              />
            ))
          }
          <div>
            <Button
              label={ formatMessage({ id: 'deletions-label' })}
            />
          </div>
        </Paragraph>
      </Page>
    )
  }
}

// StacksPage container
const mapStateProps = (state) => (
  {
    projectConfigId: state.projectConfig.id,
    members: state.projectConfig.users
  }
)

const MembersPageContainer = compose(
  connect(
    mapStateProps,
    {
      getProjectConfig,
      setNavVisibility
    }
  ),
  injectIntl
)(MembersPage)


export default MembersPageContainer
