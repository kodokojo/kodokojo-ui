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

import find from 'lodash/find'
import cloneDeep from 'lodash/cloneDeep'

import {
  BREADCRUMB_INIT,
  BREADCRUMB_UPDATE
} from '../../commons/constants'
import {
  getBreadcrumb,
  getBreadcrumbItemFromPath,
  breadcrumbItemFactory
} from '../../services/param.service'

// TODO UT
export function updateBreadcrumb(breadcrumb) {
  return {
    type: BREADCRUMB_UPDATE,
    breadcrumb
  }
}

export function updateBreadcrumbProject(projectName) {
  return (dispatch, getState) => {
    const breadcrumb = cloneDeep(getState().breadcrumb)
    const nextBreadcrumb = getBreadcrumb({
      organisation: find(breadcrumb, { type: 'organisation' }),
      project: breadcrumbItemFactory({
        labelText: projectName,
        type: 'project'
      }),
      menu: find(breadcrumb, { type: 'menu' })
    })

    return dispatch(updateBreadcrumb(nextBreadcrumb))
  }
}

export function updateBreadcrumbPath(path) {
  return (dispatch, getState) => {
    const state = getState()

    const organisation = breadcrumbItemFactory({
      labelText: state.context.organisation.name || '',
      type: 'organisation'
    })
    const project = breadcrumbItemFactory({
      labelText: state.context.projectConfig.name || '',
      type: 'project'
    })
    const menu = getBreadcrumbItemFromPath(path)
    const nextBreadcrumb = getBreadcrumb({
      organisation,
      project,
      menu
    })

    return dispatch(updateBreadcrumb(nextBreadcrumb))
  }
}

export function initBreadcrumbDefault() {
  return {
    type: BREADCRUMB_INIT,
    breadcrumb: []
  }
}

export function initBreadcrumb(location) {
  return dispatch => dispatch(initBreadcrumbDefault())
    .then(data => {
      if (location) {
        return dispatch(updateBreadcrumbPath(location))
      }
      return Promise.resolve(data)
    })
}
