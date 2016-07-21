import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { themr } from 'react-css-themr'

// UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import { setTheme, setLocale, setNavVisibility } from './app.actions'
const lightTheme = getMuiTheme()
const darkTheme = getMuiTheme(darkBaseTheme)

// Component
import { APP } from '../../commons/identifiers'
import '../../../styles/_commons.less'
import '../../../favicon.ico'
import '../../../images/logo-kodokojo-icon.png'
import Layout from '../_ui/layout/Layout.component'
import Nav from '../_ui/nav/Nav.component.js'
import Panel from '../_ui/panel/Panel.component'
import Content from '../_ui/content/Content.component.js'
import AppHeader from './AppHeader.component'
import Menu from '../menu/Menu.component'
import { logout } from '../login/login.actions'
import { requestWebsocket } from '../websocket/websocket.actions'

class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    menu: PropTypes.array,
    navigation: PropTypes.bool,
    requestWebsocket: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    setNavVisibility: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired
  }

  componentWillMount = () => {
    const { isAuthenticated, requestWebsocket } = this.props  // eslint-disable-line no-shadow

    if (isAuthenticated) {
      requestWebsocket()
    }
  }

  render() {
    const { children, isAuthenticated, locale, logout, menu, navigation, setLocale, theme } = this.props // eslint-disable-line no-shadow
    const currentMuiTheme = (theme === 'light') ? lightTheme : darkTheme

    return (
      // TODO remove MuiThemeProvider after removing all dependency to MUI (replace by custom theme provider)
      // Replace by themr, see https://github.com/javivelasco/react-css-themr for detail to how implement theme configuration
      <MuiThemeProvider muiTheme={ currentMuiTheme }>
      <Layout>
        <AppHeader
          isAuthenticated={ isAuthenticated || false }
          languageSelected={ locale }
          onLanguageChange={ (value) => setLocale(value) }
          onLogout={ () => logout() }
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
      </Layout>
      </MuiThemeProvider>
    )
  }
}

const mapStateProps = (state, ownProps) => (
  {
    locale: state.prefs.locale,
    theme: state.prefs.theme,
    menu: state.menu,
    navigation: state.prefs.navigation,
    isAuthenticated: state.auth.isAuthenticated
  }
)

export default themr(APP)(connect(
  mapStateProps,
  {
    logout,
    requestWebsocket,
    setTheme,
    setLocale,
    setNavVisibility
  }
)(App))
