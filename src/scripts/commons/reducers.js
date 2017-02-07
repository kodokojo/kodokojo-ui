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

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import alerts from '../components/alert/alert.reducer'
import auth from '../components/auth/auth.reducer'
import bricks from '../components/brick/brick.reducer'
import menu from '../components/menu/menu.reducer'
import db from '../components/db/db.reducer'
import prefs, * as fromPrefs from '../components/app/app.reducer'
import projectConfig, * as fromProjectConfig from '../components/projectConfig/projectConfig.reducer'
import socket from '../components/_utils/websocket/websocket.reducer'
import users, * as fromUser from '../components/user/user.reducer'

const rootReducer = combineReducers({
  alerts,
  auth,
  bricks,
  db,
  menu,
  prefs,
  projectConfig,
  socket,
  users,
  // redux-form reducer
  form: formReducer,
  // react-redux-router reducer
  routing: routerReducer
})

export default rootReducer


// TODO UT
// selectors
//users
export const getUser = (userId, state) => fromUser.getUser(userId, state.users)

// projectConfig
export const getAggregatedStackStatus = (state) => fromProjectConfig.getAggregatedStackStatus(state.projectConfig)

// prefs
export const getCrispKey = (state) => fromPrefs.getCrispKey(state.prefs)
export const getHelpEmail = (state) => fromPrefs.getHelpEmail(state.prefs)
export const getReCaptchaKey = (state) => fromPrefs.getReCaptchaKey(state.prefs)
export const getSignup = (state) => fromPrefs.getSignup(state.prefs)
export const getTosUri = (state) => fromPrefs.getTosUri(state.prefs)
export const getWaitingList = (state) => fromPrefs.getWaitingList(state.prefs)

