/**
 * Kodo Kojo - Software factory done right
 * Copyright © 2016 Kodo Kojo (infos@kodokojo.io)
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

// status
import statusDefault from '../../images/status-default-small.svg'
import statusStarting from '../../images/status-starting-small.gif'
import statusRunning from '../../images/status-running-small.svg'
import statusFailure from '../../images/status-failure-small.svg'

// bricks
import brickGitlab from '../../images/brick-gitlab.svg'
import brickJenkins from '../../images/brick-jenkins.svg'
import brickNexus from '../../images/brick-nexus.svg'
import brickDockerRegistry from '../../images/brick-docker-registry.svg'

export const enumStatus = {
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

export const getStatusByState = (state) => (
  find(enumStatus, { label: state }) || enumStatus.UNKNOWN
)

export const getStatusByOrder = (order) => (
  find(enumStatus, { order }) || enumStatus.UNKNOWN
)

export const enumBrickLogos = {
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

export const getBrickLogo = (state) => (
  find(enumBrickLogos, { name: state.name }) || undefined
)

export const getMenu = () => (
  {
    0: {
      disabled: true,
      index: 0,
      labelKey: 'projects-label',
      level: 0,
      // TODO change to real route when page is done
      route: '#projects',
      titleText: 'disabled because projects page does not exist'
    },
    1: {
      index: 1,
      disabled: true,
      labelText: '',
      titleText: ''
    },
    2: {
      active: false,
      index: 2,
      labelKey: 'stacks-label',
      level: 1,
      route: '/stacks',
      titleKey: 'stacks-label'
    },
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

export const getRecaptchaSitekey = () => '6LcGKykTAAAAAFQN1DFXi9rwARB6YUut_HCvs7bT'
