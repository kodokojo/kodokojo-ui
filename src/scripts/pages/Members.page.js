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
import some from 'lodash/some'

// Component
import '../../styles/_commons.less'
import utilsTheme from '../../styles/_utils.scss'
import userTheme from '../components/user/user.scss'
import messageTheme from '../components/message/message.scss'
import Page from '../components/_ui/page/Page.component'
import Action from '../components/_ui/page/Action.component'
import Button from '../components/_ui/button/Button.component'
import Dialog from '../components/_ui/dialog/Dialog.component'
import Paragraph from '../components/_ui/page/Paragraph.component'
import User from '../components/user/User.component'
import UserForm from '../components/user/UserForm.component'
import UserAddButton from '../components/user/UserAddButton.component'
import Status from '../components/status/Status.component'
import { setNavVisibility } from '../components/app/app.actions'
import {
  addUserToProjectConfig,
  getProjectConfigAndProject,
  getProjectConfig,
  deleteUsersFromProjectConfig
} from '../components/projectConfig/projectConfig.actions'
import { getAggregatedStackStatus } from '../commons/reducers'
import { filterCheckedMembers } from '../services/stateUpdater.service'

// TODO UT
// MembersPage component
export class MembersPage extends Component {

  static propTypes = {
    addUserToProjectConfig: PropTypes.func,
    aggregatedStackStatus: PropTypes.object,
    deleteUsersFromProjectConfig: PropTypes.func.isRequired,
    getProjectConfig: PropTypes.func,
    getProjectConfigAndProject: PropTypes.func,
    intl: intlShape.isRequired,
    members: PropTypes.array,
    projectConfigId: PropTypes.string,
    projectId: PropTypes.string,
    setNavVisibility: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isUserFormAddActive: false,
      isUserFormEditActive: false,
      isConfirmActive: false,
      memberList: {}
    }
  }

  componentWillMount() {
    const { getProjectConfig, getProjectConfigAndProject, members, projectConfigId, projectId } = this.props // eslint-disable-line no-shadow

    this.initNav()

    if (!members && projectConfigId && !projectId) {
      getProjectConfig(projectConfigId)
    } else if (!members && projectConfigId && projectId) {
      getProjectConfigAndProject(projectConfigId, projectId)
    } else if (!projectConfigId) {
      // TODO no projectConfigId case
    }
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(true)
  }

  handleToggleMemberAdd = () => {
    // NB this method triggers false react setState warnings on dev mode due to webpack dev server
    // but fortunately, this warnings are not thrown in production mode
    this.setState({
      ...this.state,
      isUserFormAddActive: !this.state.isUserFormAddActive
    })
  }

  handleToggleUserEdit = (userId) => {
    this.setState({
      ...this.state,
      isUserFormEditActive: false,
      memberList: {
        ...this.state.memberList,
        [userId]: {
          checked: this.state.memberList[userId].checked,
          edited: false
        }
      }
    })
  }

  handleMemberChangeState = (userState) => {
    // merge existing members with checked or unchecked one from user component
    this.setState({
      ...this.state,
      isUserFormEditActive: some(userState, 'edited'),
      memberList: {
        ...this.state.memberList,
        ...userState
      }
    })
  }

  handleOpenConfirmDelete = () => {
    this.setState({
      ...this.state,
      isConfirmActive: true
    })
  }

  handleCancelDelete = () => {
    this.setState({
      ...this.state,
      isConfirmActive: false
    })
  }

  handleConfirmDelete = () => {
    const { deleteUsersFromProjectConfig, projectConfigId } = this.props // eslint-disable-line no-shadow
    const membersToDelete = filterCheckedMembers(this.state.memberList)
    deleteUsersFromProjectConfig(projectConfigId, membersToDelete)
      .then(() => {
        this.setState({
          isUserFormAddActive: false,
          isUserFormEditActive: false,
          isConfirmActive: false,
          memberList: {}
        })
      })
      .catch(error => {
        // TODO ad ui toaster to prompt errors
        console.log(error)
      })
  }

  handleMemberAdd = (email) => {
    const { addUserToProjectConfig, projectConfigId } = this.props // eslint-disable-line no-shadow

    return addUserToProjectConfig(projectConfigId, email)
  }

  handleMemberUpdate = (email) => {
    // TODO updateUser action
  }

  render() {
    const { aggregatedStackStatus, members } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    const userClasses = classNames(userTheme.user, userTheme['user-header'])

    return (
      <Page>
        <h1 className={ utilsTheme['secondary-color--2'] }>
          <FormattedMessage id={'members-label'} />
        </h1>
        <Action>
          { !this.state.isUserFormAddActive &&
          <div>
            { aggregatedStackStatus && aggregatedStackStatus.label !== 'RUNNING' &&
            <div className={ messageTheme['message--info'] }>
              <Status
                state={ aggregatedStackStatus ? aggregatedStackStatus.label : undefined }
              />{ ' ' }
              <FormattedMessage id={'members-disabled-add-label'} />
            </div>
            }
            <UserAddButton
              disabled={
                (aggregatedStackStatus && aggregatedStackStatus.label !== 'RUNNING' ||
                this.state.isUserFormEditActive)
              }
              label={ formatMessage({ id: 'add-member-label' }) }
              onToggleForm={ this.handleToggleMemberAdd }
            />
          </div>
          }
          { this.state.isUserFormAddActive &&
            <UserForm
              creation
              disabled={ this.state.isUserFormEditActive }
              form={ 'userForm-new' }
              key={ 'addMember' }
              onCancel={ this.handleToggleMemberAdd }
              onSubmitUserFailure={ () => {} }
              onSubmitUserForm={ (email) => this.handleMemberAdd(email) }
              onSubmitUserSuccess={ this.handleToggleMemberAdd }
              onUserEditCancel={ this.handleMemberChangeState }
              userId="new"
            />
          }
        </Action>
        <Paragraph>
          <div className={ userClasses }>
            <div className={ userTheme['user-name'] }>
              <div className={ userTheme['user-spacer'] }
              ></div>
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
            <div className={ userTheme['user-select'] }>
              <FormattedMessage id={'delete-label'} />
            </div>
            <div className={ userTheme['user-edit'] }>
              <FormattedMessage id={'edit-label'} />
            </div>
          </div>
          { members && members.length > 0 &&
            members.map((userId, index) => {
              if (this.state.memberList[userId] && this.state.memberList[userId].edited) {
                return (
                  <UserForm
                    checked={ this.state.memberList[userId] ? this.state.memberList[userId].checked : false }
                    edition
                    form={ `userForm-${userId}` }
                    key={ index }
                    onCancel={ this.handleToggleUserEdit }
                    onSubmitUserFailure={ () => {} }
                    onSubmitUserForm={ (email) => this.handleMemberUpdate(email) }
                    onSubmitUserSuccess={ (editedUserId) => this.handleToggleUserEdit(editedUserId) }
                    onUserEditCancel={ this.handleMemberChangeState }
                    onUserSelect={ this.handleMemberChangeState }
                    selectable
                    userId={ userId }
                  />
                )
              }
              return (
                <User
                  checked={ this.state.memberList[userId] ? this.state.memberList[userId].checked : false }
                  disabled={
                    aggregatedStackStatus && aggregatedStackStatus.label !== 'RUNNING' ||
                    this.state.isUserFormEditActive
                  }
                  key={ index }
                  onUserEdit={ this.handleMemberChangeState }
                  onUserSelect={ this.handleMemberChangeState }
                  userId={ userId }
                />
              )
            })
          }
          { this.state.memberList && filterCheckedMembers(this.state.memberList).length > 0 &&
            <Action
              type="right"
            >
              <Button
                disabled={
                  aggregatedStackStatus && aggregatedStackStatus.label !== 'RUNNING' ||
                  this.state.isUserFormEditActive
                }
                label={ formatMessage({ id: 'delete-action-label' })}
                onClick={ this.handleOpenConfirmDelete }
              />
            </Action>
          }
          <Dialog
            actions={[
              { label: formatMessage({ id: 'cancel-label' }), onClick: this.handleCancelDelete },
              { label: formatMessage({ id: 'confirm-label' }), onClick: this.handleConfirmDelete }
            ]}
            active={ this.state.isConfirmActive }
            onEscKeyDown={ this.handleCancelDelete }
            onOverlayClick={ this.handleCancelDelete }
            title={ formatMessage({ id: 'member-delete-label' }) }
          >
            <FormattedMessage id={ 'member-delete-confirm' } />
          </Dialog>
        </Paragraph>
      </Page>
    )
  }
}

// StacksPage container
const mapStateProps = (state) => (
  {
    projectConfigId: state.projectConfig.id,
    projectId: state.projectConfig && state.projectConfig.project ? state.projectConfig.project.id : '',
    members: state.projectConfig.users,
    aggregatedStackStatus: getAggregatedStackStatus(state)
  }
)

const MembersPageContainer = compose(
  connect(
    mapStateProps,
    {
      addUserToProjectConfig,
      deleteUsersFromProjectConfig,
      getProjectConfig,
      getProjectConfigAndProject,
      setNavVisibility
    }
  ),
  injectIntl
)(MembersPage)


export default MembersPageContainer
