import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

// Component
import { centerPaper } from '../../styles/commons'
import Project from '../components/project/Project.component'

class ProjectPage extends Component {

  render() {
    return (
      <div style={ centerPaper }>
        <Project />
      </div>
    )
  }
}

const ProjectPageContainer = injectIntl(ProjectPage)

export default ProjectPageContainer