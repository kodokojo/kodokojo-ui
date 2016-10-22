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
import { connect } from 'react-redux'
import { compose } from 'redux'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

// Component
import '../../styles/_commons.less'
import Card from '../components/_ui/card/Card.component'
import CardContent from '../components/_ui/card/CardContent.component'
import CardContainer from '../components/_ui/card/CardContainer.component'
import Button from '../components/_ui/button/Button.component'
import Signup from '../components/signup/Signup.component'
import { setNavVisibility } from '../components/app/app.actions'

class SignupPage extends React.Component {

  static propTypes = {
    intl: intlShape.isRequired,
    location: React.PropTypes.object.isRequired,
    setNavVisibility: React.PropTypes.func.isRequired
  }

  componentWillMount = () => {
    this.initNav()
  }

  initNav = () => {
    const { setNavVisibility } = this.props // eslint-disable-line no-shadow

    setNavVisibility(false)
  }

  render() {
    const { formatMessage } = this.props.intl

    return (
      <CardContainer>
        <Card
          merged
          primary
          style={{ width: '400px', height: '420px', overflow: 'hidden' }}
          title={ formatMessage({ id: 'signup-title-label' }) }
        >
          <CardContent>
            <Signup />
          </CardContent>
        </Card>
        <Card
          merged
          style={{ width: '400px', height: '420px', overflow: 'hidden' }}
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
    location: ownProps.location
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
