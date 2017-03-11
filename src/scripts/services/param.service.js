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
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

// status
// import statusDefault from 'kodokojo-ui-commons/src/images/status-default-small.svg'
import statusStarting from 'kodokojo-ui-commons/src/images/status-starting-small.gif'
import statusRunning from 'kodokojo-ui-commons/src/images/status-running-small.svg'
import statusFailure from 'kodokojo-ui-commons/src/images/status-failure-small.svg'

// bricks
import brickGitlab from 'kodokojo-ui-commons/src/images/brick-gitlab.svg'
import brickJenkins from 'kodokojo-ui-commons/src/images/brick-jenkins.svg'
import brickNexus from 'kodokojo-ui-commons/src/images/brick-nexus.svg'
import brickDockerRegistry from 'kodokojo-ui-commons/src/images/brick-docker-registry.svg'

const paramService = {}

// status params
paramService.enumStatus = {
  FAILURE: {
    order: 0,
    label: 'ONFAILURE',
    image: statusFailure
  },
  UNKNOWN: {
    order: 1,
    label: 'UNKNOWN',
    // FIXME to prove that something is running, default status as been replace by starting until best idea
    image: statusStarting
  },
  STARTING: {
    order: 2,
    label: 'STARTING',
    image: statusStarting
  },
  CONFIGURING: {
    order: 3,
    label: 'CONFIGURING',
    image: statusStarting
  },
  RUNNING: {
    order: 4,
    label: 'RUNNING',
    image: statusRunning
  }
  // ALLREADYEXIST: {
  //   label: 'exist',
  //   image: ''
  // },
  // STOPPED: {
  //   label: 'stopped',
  //   image: ''
  // }
}

paramService.getStatusByState = (label) => (
  find(paramService.enumStatus, { label }) || paramService.enumStatus.UNKNOWN
)

paramService.getStatusByOrder = (order) => (
  find(paramService.enumStatus, { order }) || paramService.enumStatus.UNKNOWN
)

// bricks params
paramService.enumBrickLogos = {
  GITLAB: {
    name: 'gitlab',
    image: brickGitlab
  },
  JENKINS: {
    name: 'jenkins',
    image: brickJenkins
  },
  NEXUS: {
    name: 'nexus',
    image: brickNexus
  },
  DOCKERREGISTRY: {
    name: 'dockerregistry',
    image: brickDockerRegistry
  }
}

paramService.getBrickLogo = (name) => (
  find(paramService.enumBrickLogos, { name }) || undefined
)

// menu params
paramService.getMenu = () => (
  {
    // projects menu
    0: {
      disabled: true,
      index: 0,
      labelKey: 'projects-label',
      level: 0,
      // TODO change to real route when page is done
      route: '#projects',
      titleText: 'disabled because projects page does not exist'
    },
    // current project name
    1: {
      index: 1,
      disabled: true,
      labelText: '',
      titleText: ''
    },
    // current project stacks menu
    2: {
      active: false,
      index: 2,
      labelKey: 'stacks-label',
      level: 1,
      route: '/stacks',
      titleKey: 'stacks-label'
    },
    // current project members menu
    3: {
      active: false,
      index: 3,
      labelKey: 'members-label',
      level: 2,
      route: '/members',
      titleKey: 'members-label'
    }
  }
)

// breadcrumb params
// FIXME duplicate code with menu... find a better way
paramService.enumBreadcrumb = {
  root: {
    route: '/',
    hidden: true
  },
  login: {
    route: '/login',
    hidden: true
  },
  signup: {
    route: '/signup',
    hidden: true
  },
  projects: {
    labelKey: 'projects-label',
    titleKey: 'projects-label',
    // TODO change to real route when page is done
    route: '#projects',
    type: 'project',
    disabled: true
  },
  stacks: {
    variant: 0,
    labelKey: 'stacks-label',
    titleKey: 'stacks-label',
    route: '/stacks',
    type: 'menu',
    disabled: true
  },
  members: {
    variant: 1,
    labelKey: 'members-label',
    titleKey: 'members-label',
    route: '/members',
    type: 'menu',
    disabled: true
  }
}

// breadcrumb projects item (if no current project is selected)
paramService.getBreadcrumbItemProjects = () => paramService.enumBreadcrumb['projects']

paramService.getBreadcrumbItemFromPath = (path) => {
  return find(paramService.enumBreadcrumb, { route: path})
}

// TODO UT
/**
 * Compute breadcrumb item from info and blue print
 * 
 * @param {string} labelText
 * @param {string} route
 * @param {string} type
 * @returns {object} breadcrumbItem || null
 */
paramService.breadcrumbItemFactory = ({
  labelText,
  route = '',
  type = 'menu'
}) => {
  if (!isEmpty(labelText)) {
    return {
      labelText,
      titleText: labelText,
      route,
      type,
    }
  }
}

// TODO UT
/**
 *
 * @param {Object} organisation
 * @param {Object} project
 * @param {Object} menu
 * @returns {Array} breadcrumb || []
 */
paramService.getBreadcrumb = ({
  organisation,
  project = paramService.getBreadcrumbItemProjects(),
  menu
}) => {
  const breadcrumb = {
    organisation: {
      ...organisation,
      disabled: false
    },
    project: {
      ...project,
      disabled: true
    },
    menu: {
      ...menu,
      disabled: true
    }
  }
  // if the route is a menu that have hidden prop, clear breadcrumb
  if (breadcrumb.menu && breadcrumb.menu.hidden) {
    return []
  }
  // else filter empty items
  return filter([
    breadcrumb.organisation,
    breadcrumb.project,
    breadcrumb.menu
  ], o => {
    return !(isEmpty(o.labelKey) && isEmpty(o.labelText))
  })
}

// groups params
paramService.enumGroups = {
  ROOT: {
    id: 3,
    label: 'ROOT'
  },
  ADMIN: {
    id: 2,
    label: 'ADMIN'
  },
  TEAM_LEADER: {
    id: 1,
    label: 'TEAM_LEADER'
  },
  USER: {
    id: 0,
    label: 'USER'
  }
}

paramService.getGroupById = (id) => (
  find(paramService.enumGroups, { id }) || undefined
)

paramService.getGroupByLabel = (label) => (
  find(paramService.enumGroups, { label }) || undefined
)

// public API
export const enumStatus = paramService.enumStatus
export const getStatusByState = paramService.getStatusByState
export const getStatusByOrder = paramService.getStatusByOrder
export const enumBrickLogos = paramService.enumBrickLogos
export const getBrickLogo = paramService.getBrickLogo
export const getMenu = paramService.getMenu
export const getBreadcrumb = paramService.getBreadcrumb
export const getBreadcrumbItemProject = paramService.getBreadcrumbItemProjects
export const getBreadcrumbItemFromPath = paramService.getBreadcrumbItemFromPath
export const breadcrumbItemFactory = paramService.breadcrumbItemFactory
export const enumGroups = paramService.enumGroups
export const getGroupById = paramService.getGroupById
export const getGroupByLabel = paramService.getGroupByLabel

export default paramService
