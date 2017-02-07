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
import Promise from 'bluebird'
import { browserHistory } from 'react-router'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import Card from 'kodokojo-ui-commons/src/scripts/components/card/Card.component'
import CardContent from 'kodokojo-ui-commons/src/scripts/components/card/CardContent.component'
import CardContainer from 'kodokojo-ui-commons/src/scripts/components/card/CardContainer.component'
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'

// Component
import Login from '../components/login/Login.component'
import { getWaitingList, getSignup } from '../commons/reducers'
import { setNavVisibility } from '../components/app/app.actions'
import { login } from '../components/login/login.actions'

class LoginPage extends React.Component {

  static propTypes = {
    intl: intlShape.isRequired,
    isAuthenticated: React.PropTypes.bool,
    location: React.PropTypes.object.isRequired,
    login: React.PropTypes.func,
    setNavVisibility: React.PropTypes.func.isRequired,
    signup: React.PropTypes.bool,
    waitingList: React.PropTypes.bool
  }

  componentWillMount = () => {
    const { isAuthenticated, login } = this.props // eslint-disable-line no-shadow

    this.initNav()

    if (isAuthenticated) {
      return login()
        .catch(err => err)
    }
    return Promise.resolve()
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(false)
  }

  render() {
    const { formatMessage } = this.props.intl
    const { signup, waitingList } = this.props

    return (
      <CardContainer>
        {/* optional feature */}
        { signup &&
          <Card
            merged
            style={{ width: '400px' }}
            title={ formatMessage({ id: 'signup-title-label' }) }
          >
            <CardContent>
              <p>
                <FormattedMessage id={'login-to-signup-text'}/>
              </p>
              <div>
                {/*
                 // TODO use toggle feature
                 <Button
                 label={ formatMessage({ id: 'signup-label' }) }
                 onClick={ () => browserHistory.push('/') }
                 title={ formatMessage({ id: 'signup-label' }) }
                 />
                 */}
                <Button
                  label={ waitingList ? formatMessage({ id: 'register-label' }) : formatMessage({ id: 'signup-label' }) }
                  onClick={ () => browserHistory.push('/') }
                  title={ waitingList ? formatMessage({ id: 'register-label' }) : formatMessage({ id: 'signup-label' }) }
                />
              </div>
            </CardContent>
          </Card>
        }
        <Card
          merged={ signup }
          primary
          style={{ width: '400px' }}
          title={ signup ? formatMessage({ id: 'login-title-label' }) : formatMessage({ id: 'login-alternate-title-label' }) }
        >
          <CardContent>
            <Login/>
          </CardContent>
        </Card>
      </CardContainer>
    )
  }
}

// LoginPage container
const mapStateProps = (state, ownProps) => (
  {
    isAuthenticated: state.auth.isAuthenticated,
    location: ownProps.location,
    signup: getSignup(state),
    waitingList: getWaitingList(state)
  }
)

const LoginPageContainer = compose(
  connect(
    mapStateProps,
    {
      login,
      setNavVisibility
    }
  ),
  injectIntl
)(LoginPage)

export default LoginPageContainer

