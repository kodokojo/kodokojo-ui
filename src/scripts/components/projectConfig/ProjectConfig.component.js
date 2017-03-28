import React from 'react'
import classNames from 'classnames'

// Component commons
import FontIcon from 'kodokojo-ui-commons/src/scripts/components/fontIcon/FontIcon.component'

// Component
import theme from './projectConfig.scss'
import Status from '../status/Status.component'

const ProjectConfig = ({
  id,
  name,
  onSelectOProject,
  usersNumber,
  selected,
  status
}) => (
  <div
    className={ classNames(theme['projectConfig'], {
      [theme['projectConfig--selected']]: selected
    }) }
    onClick={ () => onSelectOProject(id) }
    title={ name }
  >
    <div className={ theme['projectConfig-header']}>
      { name }
    </div>
    <div className={ theme['projectConfig-info']}>
      <div className={ theme['info-status']}>
        <Status
          size="big"
          state={ status }
        />
      </div>
      <div className={ theme['info-users']}>
        <FontIcon
          className={ theme['users-icon'] }
          value="person"
        />
        { usersNumber }
      </div>
    </div>
    <div className={ theme['projectConfig-footer']}>
      { ' ' }
    </div>
  </div>
)

ProjectConfig.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  onSelectOProject: React.PropTypes.func,
  project: React.PropTypes.object,
  selected: React.PropTypes.bool,
  status: React.PropTypes.oneOf(['UNKNOWN', 'STARTING', 'CONFIGURING', 'ONFAILURE', 'RUNNING']),
  usersNumber: React.PropTypes.number
}

export default ProjectConfig
