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

import { browserHistory } from 'react-router'
import Promise from 'bluebird'
import isEmpty from 'lodash/isEmpty'

import { eventInit } from '../event/event.actions'
import { getProjectConfigAndProject } from '../projectConfig/projectConfig.actions'
import { initMenu, updateMenuPath, updateMenuProject } from '../menu/menu.actions'
import { initBreadcrumb, updateBreadcrumbPath, updateBreadcrumbProject } from '../breadcrumb/breadcrumb.actions'

export function updateNavigation(location, state) {
  return (dispatch, getState) => {
    const prevMenu = state.menu
    const prevBreadcrumb = state.breadcrumb
    dispatch(requestBreadcrumb(location, prevBreadcrumb))
    dispatch(updateMenuPath(location))
    dispatch(updateNavigationProject())
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

export function updateNavigationProject() {
  return (dispatch, getState) => {
    const projectConfigState = getState().context.projectConfig
    if (projectConfigState && projectConfigState.name) {
      return Promise.all([
        dispatch(updateMenuProject(projectConfigState.name)),
        dispatch(updateBreadcrumbProject(projectConfigState.name))
      ])
    }
  }
}

// TODO UT
export function routeToContext(routing, context) {
  return dispatch => {
    // if route exist before accessing login, reroute to it
    if (
      routing && routing.locationBeforeTransitions &&
      routing.locationBeforeTransitions.state && routing.locationBeforeTransitions.state.nextPathname
    ) {
      return dispatch(eventInit())
        .then(() => Promise.resolve(browserHistory.push(routing.locationBeforeTransitions.state.nextPathname)))
    } else if (
      context.projectConfig &&
      context.projectConfig.id
    ) {
      if (context.project && context.project.id) {
        // get project config and project and redirect to project
        return dispatch(
          getProjectConfigAndProject(context.projectConfig.id, context.project.id))
          .then(dispatch(eventInit()))
          .then(() => Promise.resolve(browserHistory.push('/stacks')))
      } else {
        // TODO second case, project config has no project id
        // must redirect to project config stack, with a button to start it
        return dispatch(eventInit())
      }
    }
    // if no ids, redirect to first project
    return dispatch(eventInit())
      .then(() => Promise.resolve(browserHistory.push('/projects')))
  }
}
