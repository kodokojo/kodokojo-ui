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

import persistenceStore from './persistenceStore'
import eventSourceMiddleware from '../middlewares/eventSource.middleware'
import rootReducer from '../commons/reducers'

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
      eventSourceMiddleware
    ),
    persistenceStore
  )(createStore)

  return finalCreateStore(
      rootReducer
      , initialState)
}
