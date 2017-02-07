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
import { browserHistory } from 'react-router'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import themeCardContent from 'kodokojo-ui-commons/src/scripts/components/card/cardContent.scss'
import Card from 'kodokojo-ui-commons/src/scripts/components/card/Card.component'
import CardContent from 'kodokojo-ui-commons/src/scripts/components/card/CardContent.component'
import CardContainer from 'kodokojo-ui-commons/src/scripts/components/card/CardContainer.component'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'

// Component
import Signup from '../components/signup/Signup.component'
import { getSignup, getWaitingList } from '../commons/reducers'
import { setNavVisibility } from '../components/app/app.actions'

class SignupPage extends React.Component {

  static propTypes = {
    intl: intlShape.isRequired,
    isAuthenticated: React.PropTypes.bool.isRequired,
    location: React.PropTypes.object.isRequired,
    projectConfigId: React.PropTypes.string,
    projectId: React.PropTypes.string,
    setNavVisibility: React.PropTypes.func.isRequired,
    signup: React.PropTypes.bool,
    waitingList: React.PropTypes.bool
  }

  componentWillMount = () => {
    const { isAuthenticated, projectConfigId, projectId, signup } = this.props // eslint-disable-line no-shadow

    // optional feature
    if (!signup) {
      browserHistory.push('/login')
    }

    this.initNav()

    if (isAuthenticated) {
      if (projectConfigId && !projectId) {
        browserHistory.push('/firstProject')
      } else if (projectConfigId && projectId) {
        browserHistory.push('/stacks')
      } else if (!projectConfigId) {
        // TODO no projectConfigId case
      }
    }
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(false)
  }

  render() {
    const { formatMessage } = this.props.intl
    const { waitingList } = this.props

    return (
      <CardContainer>
        <Card
          merged
          primary
          style={{ width: '400px' }}
          title={ formatMessage({ id: 'signup-title-label' }) }
        >
          <CardContent>
            { waitingList &&
              <p className={ themeCardContent['card-paragraph--warning'] }>
                <FormattedMessage
                  id="signup-wait-list-text"
                  values={{
                    registerWaitingList: (
                      <strong><FormattedMessage id="register-waiting-list-label"/></strong>
                    )
                  }}
                />
              </p>
            }
            <Signup />
          </CardContent>
        </Card>
        <Card
          merged
          style={{ width: '400px' }}
          title={ formatMessage({ id: 'login-title-label' }) }
        >
          <CardContent>
            <p>
              <FormattedMessage id={'signup-to-login-text'}/>
            </p>
            <div>
              <Button
                label={ formatMessage({ id: 'login-label' }) }
                onClick={ () => browserHistory.push('/login') }
                title={ formatMessage({ id: 'login-label' }) }
              />
            </div>
          </CardContent>
        </Card>
      </CardContainer>
    )
  }
}

// SignupPage container
const mapStateProps = (state, ownProps) => (
  {
    isAuthenticated: state.auth.isAuthenticated,
    location: ownProps.location,
    projectConfigId: state.projectConfig ? state.projectConfig.id : '',
    projectId: state.projectConfig && state.projectConfig.project ? state.projectConfig.project.id : '',
    signup: getSignup(state),
    waitingList: getWaitingList(state)
  }
)

const SignupPageContainer = compose(
  connect(
    mapStateProps,
    {
      setNavVisibility
    }
  ),
  injectIntl
)(SignupPage)

export default SignupPageContainer
