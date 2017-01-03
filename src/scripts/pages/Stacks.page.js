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

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import utilsTheme from 'kodokojo-ui-commons/src/styles/_utils.scss'
import Page from 'kodokojo-ui-commons/src/scripts/components/page/Page.component'
import Paragraph from 'kodokojo-ui-commons/src/scripts/components/page/Paragraph.component'

// Component
import brickTheme from '../components/brick/brick.scss'
import Brick from '../components/brick/Brick.component'
import { setNavVisibility } from '../components/app/app.actions'
// import { updateProject } from '../components/project/project.actions'
import { getProjectConfig, getProjectConfigAndProject } from '../components/projectConfig/projectConfig.actions'

export class StacksPage extends React.Component {

  static propTypes = {
    getProjectConfig: React.PropTypes.func,
    getProjectConfigAndProject: React.PropTypes.func,
    intl: intlShape.isRequired,
    projectConfigId: React.PropTypes.string,
    projectId: React.PropTypes.string,
    setNavVisibility: React.PropTypes.func.isRequired,
    stacks: React.PropTypes.array
  }

  componentWillMount = () => {
    const { getProjectConfig, getProjectConfigAndProject, projectConfigId, projectId } = this.props // eslint-disable-line no-shadow

    this.initNav()
    if (projectConfigId && !projectId) {
      getProjectConfig(projectConfigId)
    } else if (projectConfigId && projectId) {
      getProjectConfigAndProject(projectConfigId, projectId)
    } else if (!projectConfigId) {
      // TODO no projectConfigId case
    }
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(true)
  }

  render() {
    const { stacks } = this.props // eslint-disable-line no-shadow
    const brickClasses = classNames(brickTheme.brick, brickTheme['brick-header'])

    return (
      <Page>
        <h1 className={ utilsTheme['secondary-color--1'] }>
          <FormattedMessage id={'stacks-label'} />
        </h1>
        <Paragraph>
          <div className={ brickClasses }>
            <div className={ brickTheme['brick-type'] }>
              <FormattedMessage id={ 'type-label' } />
            </div>
            <div className={ brickTheme['brick-name'] }>
              <FormattedMessage id={ 'name-label' } />
            </div>
            <div className={ brickTheme['brick-state'] }>
              <FormattedMessage id={ 'status-label' } />
            </div>
            <div className={ brickTheme['brick-version'] }>
              <FormattedMessage id={ 'version-label' } />
            </div>
            <div className={ brickTheme['brick-link'] }>
              <FormattedMessage id={ 'link-label' } />
            </div>
          </div>
          { stacks && stacks[0] && stacks[0].bricks &&
            stacks[0].bricks.map((brick, index) => (
              <Brick brick={ brick } key={ index } />
            ))
          }
        </Paragraph>
      </Page>
    )
  }
}

// StacksPage container
const mapStateProps = (state, ownProps) => (
  {
    location: ownProps.location,
    projectConfigId: state.projectConfig ? state.projectConfig.id : '',
    projectId: state.projectConfig && state.projectConfig.project ? state.projectConfig.project.id : '',
    stacks: state.projectConfig.stacks
  }
)

const StacksPageContainer = compose(
  connect(
    mapStateProps,
    {
      getProjectConfig,
      getProjectConfigAndProject,
      setNavVisibility
    }
  ),
  injectIntl
)(StacksPage)


export default StacksPageContainer
