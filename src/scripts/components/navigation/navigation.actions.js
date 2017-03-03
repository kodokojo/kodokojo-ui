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
