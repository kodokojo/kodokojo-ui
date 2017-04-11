import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

// Component commons
import FontIcon from 'kodokojo-ui-commons/src/scripts/components/fontIcon/FontIcon.component'
import { getAggregatedStackStatus } from '../../commons/reducers'

// Component
import theme from './projectConfig.scss'
import Status from '../status/Status.component'

export class ProjectConfig extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    onSelectProjectConfig: React.PropTypes.func,
    project: React.PropTypes.object,
    selected: React.PropTypes.bool,
    status: React.PropTypes.object,
    usersNumber: React.PropTypes.number
  }

  render() {
    const { id, name, onSelectProjectConfig, usersNumber, selected, status } = this.props

    return (
      <div
        className={ classNames(theme['projectConfig'], {
          [theme['projectConfig--selected']]: selected
        }) }
        onClick={ onSelectProjectConfig }
        title={ name }
      >
        <div className={ theme['projectConfig-header']}>
          { name }
        </div>
        <div className={ theme['projectConfig-info']}>
          <div className={ theme['info-status']}>
            <Status
              size="big"
              state={ status && status.label ? status.label : 'UNKNOWN' }
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
  }
}

// ProjectConfigContainer container
const mapStateProps = (state, ownProps) => (
  {
    status: getAggregatedStackStatus(state, ownProps.id)
  }
)

const ProjectConfigContainer = connect(
  mapStateProps,
  {}
)(ProjectConfig)


export default ProjectConfigContainer
