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
