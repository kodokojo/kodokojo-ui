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
import auth, * as fromAuth from '../components/auth/auth.reducer'
import context from '../components/context/context.reducer'
import breadcrumb from '../components/breadcrumb/breadcrumb.reducer'
import bricks from '../components/brick/brick.reducer'
import menu from '../components/menu/menu.reducer'
import organisation from '../components/organisation/organisation.reducer'
import db from '../components/db/db.reducer'
import prefs, * as fromPrefs from '../components/app/app.reducer'
import projectConfig, * as fromProjectConfig from '../components/projectConfig/projectConfig.reducer'
import event from '../components/event/event.reducer'
import users, * as fromUser from '../components/user/user.reducer'

const rootReducer = combineReducers({
  alerts,
  auth,
  breadcrumb,
  bricks,
  context,
  db,
  menu,
  organisation,
  prefs,
  projectConfig,
  event,
  users,
  // redux-form reducer
  form: formReducer,
  // react-redux-router reducer
  routing: routerReducer
})

export default rootReducer

// TODO UT
// selectors
// auth
export const getAuthUserOrganisations = (state) => fromAuth.getAuthUserOrganisations(state.auth)
export const getAuthUserProjectConfigs = (state, organisationId) => fromAuth.getAuthUserProjectConfigs(state.auth, organisationId)

// users
export const getUserFromId = (userId, state) => fromUser.getUserFromId(userId, state.users)

// projectConfig
export const getProjectConfigUsers = (state, projectConfigId) => fromProjectConfig.getProjectConfigUsers(state.projectConfig, projectConfigId)
export const getProjectConfigStacks = (state, projectConfigId) => fromProjectConfig.getProjectConfigStacks(state.projectConfig, projectConfigId)
export const getAggregatedStackStatus = (state, projectConfigId) => fromProjectConfig.getAggregatedStackStatus(state.projectConfig, projectConfigId)
export const getProjectConfigs = (state) => fromProjectConfig.getProjectConfigs(state.projectConfig)


// prefs
export const getCrispKey = (state) => fromPrefs.getCrispKey(state.prefs)
export const getHelpEmail = (state) => fromPrefs.getHelpEmail(state.prefs)
export const getReCaptchaKey = (state) => fromPrefs.getReCaptchaKey(state.prefs)
export const getSignup = (state) => fromPrefs.getSignup(state.prefs)
export const getTosUri = (state) => fromPrefs.getTosUri(state.prefs)
export const getWaitingList = (state) => fromPrefs.getWaitingList(state.prefs)

