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

import { createStore, compose, applyMiddleware } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import persistenceStore from './persistenceStore'
import rootReducer from '../commons/reducers'
import eventSourceMiddleware from '../middlewares/eventSource.middleware'

export default function configureStore(initialState) {
  const finalCreateStore = compose(
      applyMiddleware(
        thunk,
        apiMiddleware,
        createLogger(),
        eventSourceMiddleware
      ),
      persistenceStore,
      global.devToolsExtension ? global.devToolsExtension() : f => f
  )(createStore)

  const store = finalCreateStore(
        rootReducer,
        initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../commons/reducers', () => {
      const nextReducer = require('../commons/reducers').default

      store.replaceReducer(nextReducer)
    })
  }

  return store
}
