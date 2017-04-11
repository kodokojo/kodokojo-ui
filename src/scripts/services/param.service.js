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
// import statusDefaultSmall from 'kodokojo-ui-commons/src/images/status-default-small.svg'
import statusStartingSmall from 'kodokojo-ui-commons/src/images/status-starting-small.gif'
import statusRunningSmall from 'kodokojo-ui-commons/src/images/status-running-small.svg'
import statusFailureSmall from 'kodokojo-ui-commons/src/images/status-failure-small.svg'
// import statusDefaultBig from 'kodokojo-ui-commons/src/images/status-default-big.svg'
import statusStartingBig from 'kodokojo-ui-commons/src/images/status-starting-big.svg'
import statusRunningBig from 'kodokojo-ui-commons/src/images/status-running-big.svg'
import statusFailureBig from 'kodokojo-ui-commons/src/images/status-failure-big.svg'

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
    image: {
      small: statusFailureSmall,
      big: statusFailureBig
    }
  },
  UNKNOWN: {
    order: 1,
    label: 'UNKNOWN',
    // FIXME to prove that something is running, default status as been replace by starting until best idea
    image: {
      small: statusStartingSmall,
      big: statusStartingBig
    }
  },
  STARTING: {
    order: 2,
    label: 'STARTING',
    image: {
      small: statusStartingSmall,
      big: statusStartingBig
    }
  },
  CONFIGURING: {
    order: 3,
    label: 'CONFIGURING',
    image: {
      small: statusStartingSmall,
      big: statusStartingBig
    }
  },
  RUNNING: {
    order: 4,
    label: 'RUNNING',
    image: {
      small: statusRunningSmall,
      big: statusRunningBig
    }
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
    // organisations menu
    organisations: {
      labelKey: 'organisations-label',
      level: 0,
      route: '/organisations',
      titleKey: 'organisations-title-label'
    },
    // projects menu
    projects: {
      labelKey: 'projects-label',
      level: 0,
      route: '/projects',
      titleKey: 'organisations-title-label'
    },
    // current project name
    project: {
      disabled: true,
      labelText: '',
      titleText: ''
    },
    // current project stacks menu
    stacks: {
      active: false,
      labelKey: 'stacks-label',
      level: 1,
      route: '/stacks',
      titleKey: 'stacks-label'
    },
    // current project members menu
    members: {
      active: false,
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
    type: 'menu',
    hidden: true
  },
  login: {
    route: '/login',
    type: 'menu',
    hidden: true
  },
  signup: {
    route: '/signup',
    type: 'menu',
    hidden: true
  },
  organisations: {
    route: '/organisations',
    root: true,
    labelKey: 'organisations-label',
    titleKey: 'organisations-label',
    disabled: true
  },
  projects: {
    route: '/projects',
    labelKey: 'projects-label',
    titleKey: 'projects-label',
    type: 'project',
    disabled: true
  },
  stacks: {
    route: '/stacks',
    variant: 0,
    labelKey: 'stacks-label',
    titleKey: 'stacks-label',
    type: 'menu',
    disabled: true
  },
  members: {
    route: '/members',
    variant: 1,
    labelKey: 'members-label',
    titleKey: 'members-label',
    type: 'menu',
    disabled: true
  }
}

paramService.getBreadcrumbItemOrganisations = () => paramService.enumBreadcrumb['organisations']

paramService.getBreadcrumbItemProjects = () => paramService.enumBreadcrumb['projects']

paramService.getBreadcrumbItemFromPath = (path) => {
  return find(paramService.enumBreadcrumb, { route: path })
}

// TODO UT
/**
 * Compute breadcrumb item from info and blue print
 * 
 * @param {String} labelText
 * @param {String} route
 * @param {String} type
 * @returns {Object} breadcrumbItem || null
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
  project,
  menu
}) => {
  const organisationDefault = paramService.getBreadcrumbItemOrganisations()
  // const projectDefault = paramService.getBreadcrumbItemProjects()

  // if the route is a menu that have hidden prop, clear breadcrumb
  if (menu && menu.hidden) {
    return []
  } else {
    const breadcrumb = {
      organisation: {
        ...organisationDefault,
        ...organisation,
        disabled: true
      }
    }

    if (project) {
      breadcrumb.organisation = {
        ...breadcrumb.organisation,
        disabled: false
      }
      breadcrumb.project = {
        ...project,
        disabled: true
      }
    }

    if (menu) {
      breadcrumb.project ={
        ...breadcrumb.project,
        disabled: false
      }
      breadcrumb.menu = {
        ...menu,
        disabled: false
      }
    }

    return Object.values(breadcrumb)
  }
}

// groups params
paramService.enumGroups = {
  ROOT: {
    id: 3,
    label: 'ROOT',
    labelKey: 'group-root-label',
    value: 'ROOT'
  },
  ADMIN: {
    id: 2,
    label: 'ADMIN',
    labelKey: 'group-admin-label',
    value: 'ADMIN'
  },
  TEAM_LEADER: {
    id: 1,
    label: 'TEAM_LEADER',
    labelKey: 'group-team-leader-label',
    value: 'TEAM_LEADER'
  },
  USER: {
    id: 0,
    label: 'USER',
    labelKey: 'group-user-label',
    value: 'USER'
  }
}

paramService.getGroupById = (id) => (
  find(paramService.enumGroups, { id }) || undefined
)

paramService.getGroupByLabel = (label) => (
  find(paramService.enumGroups, { label }) || undefined
)

// TODO UT
paramService.getGroups = (userGroup) => {
  const group = paramService.getGroupByLabel(userGroup)
  const groupId = group ? group.id : -1
  return Object.values(paramService.enumGroups).filter(groupItem => (groupItem.id <= groupId) && groupId !== 0)
}

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
export const getGroups = paramService.getGroups
export const getGroupById = paramService.getGroupById
export const getGroupByLabel = paramService.getGroupByLabel

export default paramService
