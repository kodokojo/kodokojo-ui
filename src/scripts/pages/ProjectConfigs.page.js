import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { browserHistory } from 'react-router'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import utilsTheme from 'kodokojo-ui-commons/src/styles/_utils.scss'
import Page from 'kodokojo-ui-commons/src/scripts/components/page/Page.component'
import Paragraph from 'kodokojo-ui-commons/src/scripts/components/page/Paragraph.component'
import FontIcon from 'kodokojo-ui-commons/src/scripts/components/fontIcon/FontIcon.component'

// Component
import projectConfigTheme from '../components/projectConfig/projectConfig.scss'
import ProjectConfig from '../components/projectConfig/ProjectConfig.component'
import { setNavVisibility } from '../components/app/app.actions'
import { fetchAuthentication } from '../components/auth/auth.actions'
import { getProjectConfigList, changeProjectConfig } from '../components/projectConfig/projectConfig.actions'
import { getProjectConfigs } from '../commons/reducers'


export class ProjectConfigsPage extends React.Component {
  static propTypes = {
    changeProjectConfig: React.PropTypes.func.isRequired,
    contextOrganisationId: React.PropTypes.string,
    contextProjectConfigId: React.PropTypes.string,
    fetchAuthentication: React.PropTypes.func.isRequired,
    getProjectConfigList: React.PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    projectConfigs: React.PropTypes.array,
    setNavVisibility: React.PropTypes.func.isRequired
  }

  componentWillMount = () => {
    const { contextOrganisationId, fetchAuthentication, getProjectConfigList } = this.props

    this.initNav()
    fetchAuthentication()
      .then(() => getProjectConfigList(contextOrganisationId))
  }

  initNav = () => {
    const { setNavVisibility } = this.props

    setNavVisibility(true)
  }


  handleSelectProjectConfig = (projectConfig) => {
    const { changeProjectConfig } = this.props

    return changeProjectConfig(projectConfig)
      .then(() => browserHistory.push('/stacks'))
  }

  render() {
    const { contextProjectConfigId, projectConfigs } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    return (
      <Page>
        <h1 className={ utilsTheme['secondary-color--1'] }>
          <FormattedMessage id={'projects-label'}/>
        </h1>
        <Paragraph >
          <div className={ projectConfigTheme['projectConfig-container'] }>
            <div
              className={ projectConfigTheme['projectConfig-button'] }
              onClick={ () => browserHistory.push('/newProject') }
              title={ formatMessage({ id: 'project-config-add-title-label' }) }
            >
              <FontIcon
                className={ projectConfigTheme['projectConfig-icon'] }
                value="add_circle_outline"
              />
              <FormattedMessage id={ 'project-config-add-label' }/>
            </div>
            { projectConfigs && projectConfigs.length > 0 &&
              projectConfigs.map(projectConfig => (
                <ProjectConfig
                  id={ projectConfig.id }
                  key={ projectConfig.id }
                  name={ projectConfig.name }
                  onSelectProjectConfig={ () => this.handleSelectProjectConfig(projectConfig) }
                  selected={ projectConfig.id === contextProjectConfigId }
                  usersNumber={  projectConfig.users ? projectConfig.users.length : 0 }
                />
              ))
            }
          </div>
        </Paragraph>
      </Page>
    )
  }
}

// ProjectConfigsPage container
const mapStateProps = (state) => (
  {
    contextOrganisationId: state.context.organisation.id,
    contextProjectConfigId: state.context.projectConfig.id,
    projectConfigs: getProjectConfigs(state)
  }
)

const ProjectConfigsPageContainer = compose(
  connect(
    mapStateProps,
    {
      changeProjectConfig,
      fetchAuthentication,
      getProjectConfigList,
      setNavVisibility
    }
  ),
  injectIntl
)(ProjectConfigsPage)


export default ProjectConfigsPageContainer
