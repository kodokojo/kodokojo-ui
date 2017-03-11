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

import Promise from 'bluebird'
import isEmpty from 'lodash/isEmpty'

import { initMenu, updateMenuPath } from '../menu/menu.actions'
import { initBreadcrumb, updateBreadcrumbPath } from '../breadcrumb/breadcrumb.actions'

export function updateNavigation(location, state) {
  return dispatch => {
    const prevMenu = state.menu
    const prevBreadcrumb = state.breadcrumb
    if (isEmpty(prevMenu)) {
      return dispatch(initMenu(location))
        .then(data => {
          return dispatch(requestBreadcrumb(location, prevBreadcrumb))
        })
    } else {
      return dispatch(updateMenuPath(location))
        .then(() => dispatch(requestBreadcrumb(location, prevBreadcrumb)))
    }
  }
}

export function requestBreadcrumb(location, prevBreadcrumb) {
  return dispatch => {
    if (isEmpty(prevBreadcrumb)) {
      return dispatch(initBreadcrumb(location))
    } else {
      return dispatch(updateBreadcrumbPath(location))
    }
  }
}
