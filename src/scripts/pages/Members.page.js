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
import classNames from 'classnames'
import some from 'lodash/some'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import utilsTheme from 'kodokojo-ui-commons/src/styles/_utils.scss'
import Page from 'kodokojo-ui-commons/src/scripts/components/page/Page.component'
import Action from 'kodokojo-ui-commons/src/scripts/components/page/Action.component'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'
import Dialog from 'kodokojo-ui-commons/src/scripts/components/dialog/Dialog.component'
import Paragraph from 'kodokojo-ui-commons/src/scripts/components/page/Paragraph.component'

// Component
import userTheme from '../components/user/user.scss'
import messageTheme from '../components/message/message.scss'
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
import { updateUser } from '../components/user/user.actions'
import { getAggregatedStackStatus } from '../commons/reducers'
import { filterCheckedMembers } from '../services/stateUpdater.service'

// TODO UT
// MembersPage component
export class MembersPage extends React.Component {

  static propTypes = {
    addUserToProjectConfig: React.PropTypes.func,
    aggregatedStackStatus: React.PropTypes.object,
    deleteUsersFromProjectConfig: React.PropTypes.func.isRequired,
    getProjectConfig: React.PropTypes.func,
    getProjectConfigAndProject: React.PropTypes.func,
    intl: intlShape.isRequired,
    members: React.PropTypes.array,
    projectConfigId: React.PropTypes.string,
    projectId: React.PropTypes.string,
    setNavVisibility: React.PropTypes.func.isRequired,
    updateUser: React.PropTypes.func.isRequired
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

  handleMemberAdd = ({ email }) => {
    const { addUserToProjectConfig, projectConfigId } = this.props // eslint-disable-line no-shadow

    return addUserToProjectConfig(projectConfigId, email)
  }

  handleMemberUpdate = (user) => {
    const { updateUser } = this.props
    
    return updateUser(user)
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
              onSubmitUserForm={ (user) => this.handleMemberAdd(user) }
              onSubmitUserSuccess={ this.handleToggleMemberAdd }
              onUserEditCancel={ this.handleMemberChangeState }
              userId="new"
            />
          }
        </Action>
        <Paragraph>
          <div className={ userClasses }>
            <div className={ userTheme['user-name'] }>
              <div className={ userTheme['user-spacer'] }/>
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
                    onSubmitUserForm={ (user) => this.handleMemberUpdate(user) }
                    onSubmitUserSuccess={ (user) => this.handleToggleUserEdit(user.id) }
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
                    this.state.isUserFormEditActive ||
                    this.state.isUserFormAddActive
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
                  this.state.isUserFormEditActive ||
                  this.state.isUserFormAddActive
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
      setNavVisibility,
      updateUser
    }
  ),
  injectIntl
)(MembersPage)


export default MembersPageContainer
