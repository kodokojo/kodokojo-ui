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

import isEmpty from 'lodash/isEmpty'
import Promise from 'bluebird'

import { updateNavigation } from '../components/navigation/navigation.actions'
import { initMenu, updateMenuPath } from '../components/menu/menu.actions'
import { initBreadcrumb, updateBreadcrumbPath } from '../components/breadcrumb/breadcrumb.actions'

const historyService = {}

// TODO could handle analytics in the future
historyService.handleHistoryChange = (location, store) => (dispatch, getState) => {
  console.log('history service detect change: ', location) // eslint-disable-line no-console

  const state = getState()
  return dispatch(updateNavigation(location, state))

}

// public API
export const handleHistoryChange = historyService.handleHistoryChange

export default historyService
