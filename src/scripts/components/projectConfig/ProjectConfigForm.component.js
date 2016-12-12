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
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, SubmissionError, propTypes } from 'redux-form'
import { combineValidators } from 'revalidate'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import filter from 'lodash/filter'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'

// component
import '../../../styles/_commons.less'
import utilsTheme from '../../../styles/_utils.scss'
import Card from '../_ui/card/Card.component'
import CardContent from '../_ui/card/CardContent.component'
import CardContainer from '../_ui/card/CardContainer.component'
import Input from '../_ui/input/Input.component'
import Checkbox from '../_ui/checkbox/Checkbox.component'
import Button from '../_ui/button/Button.component'
import FontIcon from '../_ui/fontIcon/FontIcon.component'
import { createProjectConfig } from './projectConfig.actions'
import { projectNameValidator } from '../../services/validator.service'
import { returnErrorKeyOrMessage } from '../../services/error.service'
import { getBrickLogo } from '../../services/param.service'

// validation function
const validate = (values, props) => combineValidators({
  projectName: projectNameValidator('projectName')
})(values)

// TODO UT
// ProjectConfigForm component
export class ProjectConfigForm extends React.Component {

  static propTypes = {
    bricks: React.PropTypes.object,
    createProjectConfig: React.PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    userId: React.PropTypes.string.isRequired,
    ...propTypes
  }

  constructor(props) {
    super(props)
    this.state = {
      brickList: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(this.state.brickList) && nextProps.bricks && nextProps.bricks.list.length && nextProps.bricks.list.length > 0) {
      const defaultBricks = {}
      nextProps.bricks.list.forEach((brickType, brickTypeIndex) => {
        brickType.forEach((brick, brickIndex) => {
          defaultBricks[`brick${brickTypeIndex}-${brickIndex}`] = {
            value: brick,
            // check the first brick for a given type (SCM / CI / Repository)
            checked: brickIndex === 0
          }
        })
      })
      this.setState({
        brickList: defaultBricks
      })
    }
  }

  handleChangeBrick = (brickCheckbox, brick) => {
    const brickChecked = {
      [brickCheckbox]: {
        checked : this.state.brickList[brickCheckbox] !== undefined ? !this.state.brickList[brickCheckbox].checked : true,
        value: brick
      }
    }

    this.setState({
      brickList: {
        ...this.state.brickList,
        ...brickChecked
      }
    })
  }

  handleSubmitProject = (values) => {
    const { userId, createProjectConfig } = this.props // eslint-disable-line no-shadow

    const nextProjectName = values.projectName

    const stackConfiguration = {
      name: 'build-A',
      type: 'BUILD',
      brickConfigs: filter(this.state.brickList, { 'checked': true }).map(brickElement => brickElement.value)
    }

    return createProjectConfig(nextProjectName.trim(), userId, [userId], stackConfiguration)
      .then(Promise.resolve())
      .catch(err => Promise.reject(
        new SubmissionError(
          { projectName: returnErrorKeyOrMessage(
            {
              component: 'project',
              code: err.message
            })
          }
        )
      ))
  }

  render() {
    const { bricks, handleSubmit, submitting } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    const bricksDetails = bricks && bricks.list && bricks.list.length ? bricks.list : undefined

    return (
      <form id="projectForm"
            name="projectForm"
            noValidate
            onSubmit={ handleSubmit(this.handleSubmitProject) }
      >
        <CardContainer>
          <div style={{ display: 'flex', flex: '1 1 auto', flexFlow: 'column', alignContent: 'stretch', alignSelf: 'stretch' }}>
            <div style={{ display: 'flex', flexFlow: 'row' }}>
              <Card
                primary
                row
                style={{ flex: '1 100%', marginBottom: '10px' }}
              >
                <CardContent
                  className={ utilsTheme['content-gutter--large'] }
                  raw
                  row
                >
                  <div
                    className={ classNames(utilsTheme['title--default'], utilsTheme['content-spacer--large']) }
                    style={{ flex: '0 220px' }}
                  >
                    <span className={ utilsTheme['text-uppercase'] }>
                      <FormattedMessage id={ 'project-add-label' }/>
                    </span>
                  </div>
                  <div
                    style={{ flex: '0 60%', paddingTop: '20px' }}
                  >
                    <div style={{ width: '50%' }}>
                      <Field
                        component={ Input }
                        errorKey="project-name-label"
                        label={ formatMessage({ id: 'project-name-label' }) }
                        name="projectName"
                        required
                        type="text"
                      />
                      <Field
                        component="input"
                        id="projectUsers"
                        name="projectUsers"
                        type="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div style={{ display: 'flex', flex: '0 0 auto' }}>
              <div style={{ display: 'flex', flex: '0 200px', flexFlow: 'column', alignItems: 'stretch', justifyContent: 'stretch' }}>
                <Card
                  style={{ flex: '1 1 auto', marginRight: '10px' }}
                >
                  <CardContent
                    className={ utilsTheme['content-gutter--large'] }
                    raw
                  >
                    <div
                      className={ utilsTheme['content-spacer--large'] }
                      style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'flex-start' }}
                    >
                      <div
                        style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', flex: '1 1 auto' }}
                      >
                        <div
                          className={ classNames(utilsTheme['title--default']) }
                        >
                          <span className={ utilsTheme['text-uppercase'] }>
                            <FormattedMessage id={ 'stack-bricks-label' }/>
                          </span>
                        </div>
                        <FontIcon
                          className={ classNames(utilsTheme['icon--large'], utilsTheme['font-color--1']) }
                          value="layers"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div style={{ display: 'flex', flex: '1 1 60%', flexFlow: 'column' }} >
                <div style={{ display: 'flex', flex: '1 1 auto', flexFlow: 'column' }}>
                  { bricksDetails && bricksDetails.length > 0 &&
                    bricksDetails.map((brickType, brickTypeIndex) => (
                      <div
                        key={ brickTypeIndex }
                        style={{ display: 'flex', flex: '1 0 auto', flewFlow: 'column' }}
                      >
                        <Card
                        style={ brickTypeIndex > 0 ?
                          { display: 'flex', flex: '1 1 auto', justifyContent: 'center', alignItems: 'stretch', marginTop: '10px' } :
                          { display: 'flex', flex: '1 1 auto', justifyContent: 'center', alignItems: 'stretch' }
                        }
                      >
                        <CardContent
                          className={ utilsTheme['content-gutter--smaller'] }
                          raw
                          row
                        >
                          <div
                            style={{ display: 'flex', flex: '1 1 30%' }}
                          >
                            <div
                              className={ classNames(utilsTheme['title--default']) }
                            >
                              <FormattedMessage id={ `${brickType[0].type.toLowerCase()}-label` }/>
                            </div>
                          </div>
                          <div
                            style={{ display: 'flex', flex: '1 1 70%' }}
                          >
                            { brickType.length > 0 &&
                              brickType.map((brick, brickIndex) => (
                                <div
                                  key={ brickIndex }
                                  style={{ display: 'flex', flex: '1 1 auto', height: '70px', alignItems: 'center' }}
                                >
                                  <Checkbox
                                    checked={
                                      this.state.brickList[`brick${brickTypeIndex}-${brickIndex}`] !== undefined ?
                                      this.state.brickList[`brick${brickTypeIndex}-${brickIndex}`].checked :
                                      false
                                    }
                                    disabled={ isEmpty(this.state.brickList) }
                                    label={
                                      <span style={{ display: 'flex', flex: '1 1 auto', flexFlow: 'row', alignItems: 'center' }}>
                                        { getBrickLogo(brick).image &&
                                          <img src={ getBrickLogo(brick).image } style={{ width: '70px', height: '70px' }} />
                                        }
                                        <span className={ utilsTheme['text-capitalize'] }>
                                          <FormattedMessage id={ `brick-${getBrickLogo(brick).name}-label` } />
                                          <span className={ utilsTheme['text-normal']}>{ ` ${brick.version}` }</span>
                                        </span>
                                      </span>
                                    }
                                    onChange={ () => this.handleChangeBrick(`brick${brickTypeIndex}-${brickIndex}`,brick) }
                                  />
                                </div>
                              ))
                            }
                          </div>
                        </CardContent>
                      </Card>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button
                disabled={ submitting || size(filter(this.state.brickList, { 'checked': true })) <= 0  }
                label={ formatMessage({ id: 'create-label' }) }
                primary
                title={ formatMessage({ id: 'create-label' }) }
                type="submit"
              />
            </div>
          </div>
        </CardContainer>
      </form>
    )
  }
}

// ProjectConfigForm container
const mapStateProps = (state) => (
  {
    bricks: state.bricks,
    userId: state.auth.account && state.auth.account.id ? state.auth.account.id : ''
  }
)

const ProjectConfigFormContainer = compose(
  connect(
    mapStateProps,
    {
      createProjectConfig
    }
  ),
  injectIntl
)(reduxForm(
  {
    form: 'projectForm',
    touchOnChange: true,
    validate
  }
)(ProjectConfigForm))

export default ProjectConfigFormContainer
