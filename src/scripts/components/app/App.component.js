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
import { themr } from 'react-css-themr'
import isEmpty from 'lodash/isEmpty'

// Component
import { APP } from '../../commons/identifiers'
import '../../../styles/_commons.less'
import '../../../favicon.ico'
import '../../../images/logo-kodokojo-icon.png'
import Layout from '../_ui/layout/Layout.component'
import Nav from '../_ui/nav/Nav.component'
import Panel from '../_ui/panel/Panel.component'
import Content from '../_ui/content/Content.component'
import AppHeader from './AppHeader.component'
import Menu from '../menu/Menu.component'
import Toaster from '../_ui/toaster/Toaster.component'
import { logout } from '../login/login.actions'
import { nextAlert } from '../alert/alert.actions'
import { requestWebsocket } from '../_utils/websocket/websocket.actions'
import {
  getApiVersion,
  setTheme,
  setLocale,
  setNavVisibility
} from './app.actions'

class App extends React.Component {

  static propTypes = {
    alert: React.PropTypes.object,
    children: React.PropTypes.element.isRequired,
    getApiVersion: React.PropTypes.func.isRequired,
    isAuthenticated: React.PropTypes.bool.isRequired,
    locale: React.PropTypes.string.isRequired,
    logout: React.PropTypes.func.isRequired,
    menu: React.PropTypes.object,
    navigation: React.PropTypes.bool,
    nextAlert: React.PropTypes.func,
    requestWebsocket: React.PropTypes.func.isRequired,
    setLocale: React.PropTypes.func.isRequired,
    setNavVisibility: React.PropTypes.func.isRequired,
    theme: React.PropTypes.string.isRequired,
    version: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      alertActive: false
    }
  }

  componentWillMount = () => {
    const { isAuthenticated, requestWebsocket, getApiVersion } = this.props // eslint-disable-line no-shadow

    if (isAuthenticated) {
      requestWebsocket()
    }

    getApiVersion()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.alert && !isEmpty(nextProps.alert) && nextProps.alert.active) {
      this.setState({
        alertActive: true
      })
    }
    if (nextProps.alert && !isEmpty(nextProps.alert) && !nextProps.alert.active) {
      setTimeout(() => {
        this.setState({
          alertActive: true
        })
      }, 400)
    }
  }

  handleCloseAlert = (alertId) => {
    const { nextAlert } = this.props

    this.setState({
      alertActive: false
    })
    nextAlert(alertId)
  }

  render() {
    const { alert, children, isAuthenticated, locale, logout, menu, navigation, setLocale, theme, version } = this.props // eslint-disable-line no-shadow

    return (
      <Layout>
        <AppHeader
          isAuthenticated={ isAuthenticated || false }
          languageSelected={ locale }
          onLanguageChange={ (value) => setLocale(value) }
          onLogout={ () => logout() }
          version={ version }
        />
        <Panel>
          <Nav
            active={ navigation }
          >
            <Menu
              menu={ menu }
            />
          </Nav>
          <Content>
            { children }
          </Content>
        </Panel>
        { alert &&
          <Toaster
            action={ alert.action }
            active={ this.state.alertActive }
            icon={ alert.icon }
            labelId={ alert.labelId }
            label={ alert.label }
            onClick={ () => this.handleCloseAlert(alert.id) }
            onTimeout={ () => this.handleCloseAlert(alert.id) }
            timeout={ alert.timeout }
            variant={ alert.variant }
            type={ alert.type }
          />
        }
      </Layout>
    )
  }
}

const mapStateProps = (state, ownProps) => (
  {
    locale: state.prefs.locale,
    theme: state.prefs.theme,
    menu: state.menu,
    navigation: state.prefs.navigation,
    isAuthenticated: state.auth.isAuthenticated,
    version: state.prefs.version,
    alert: state.alerts.display
  }
)

export default themr(APP)(connect(
  mapStateProps,
  {
    getApiVersion,
    logout,
    nextAlert,
    requestWebsocket,
    setTheme,
    setLocale,
    setNavVisibility
  }
)(App))
