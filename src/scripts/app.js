import 'babel-polyfill'

// React Redux stack
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

// UI stack
import injectTapEventPlugin from 'react-tap-event-plugin'

// i18n
// shim intl if not supported by browser
import { shimIntl } from './i18n/shimIntl'
import IntlProviderContainer from './commons/IntlProviderContainer'
import { addLocaleData } from 'react-intl'
import en from '../../node_modules/react-intl/locale-data/en'
import fr from '../../node_modules/react-intl/locale-data/fr'

addLocaleData(en)
addLocaleData(fr)

// Application
import configureStore from './store/configureStore'
import initialState from './commons/init'
import App from './components/app/App.component.js'
import SignupPage from './pages/Signup.page.js'
import LoginPage from './pages/Login.page.js'
import FirstProjectPage from './pages/FirstProject.page.js'
import StacksPage from './pages/Stacks.page.js'
import MembersPage from './pages/Members.page.js'
import UsersPage from './pages/UsersPage'
import NotFoundPage from './pages/NotFoundPage'

import AuthService from './services/auth.service.js'
import { handleHistoryChange } from './services/history.service.js'

// Add the reducer to your store on the `routing` key
const store = configureStore(initialState)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)
history.listen(location => handleHistoryChange(location.pathname))

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

const initApp = () => {
  ReactDOM.render(
    <IntlProviderContainer store={store}>
      <Provider store={store}>
        { /* Tell the Router to use our enhanced history */ }
        <Router history={history}>
          <Route
            component={App}
            path="/"
          >
            <IndexRoute
              component={SignupPage}
            />
            <Route
              component={LoginPage}
              path="login"
            />
            <Route
              component={FirstProjectPage}
              onEnter={AuthService.checkAuth}
              path="firstProject"
            />
            <Route
              component={StacksPage}
              onEnter={AuthService.checkAuth}
              path="stacks"
            />
            <Route
              component={MembersPage}
              onEnter={AuthService.checkAuth}
              path="members"
            />
            <Route
              component={UsersPage}
              onEnter={AuthService.checkAuth}
              path="users"
            />
            <Route
              component={NotFoundPage}
              dataTypePage="testDataType"
              path="*"
              status={404}
            />
          </Route>
        </Router>
      </Provider>
    </IntlProviderContainer>,
    document.getElementById('app')
  )
}

// FIXME
// shim intl is necessary for safari (v9.1.1), remove later ?
shimIntl(initApp)
