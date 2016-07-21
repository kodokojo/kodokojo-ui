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

export const enumBrickStatus = {
  CONFIGURING: {
    label: 'CONFIGURING',
    image: statusStarting
  },
  STARTING: {
    label: 'STARTING',
    image: statusStarting
  },
  RUNNING: {
    label: 'RUNNING',
    image: statusRunning
  },
  FAILURE: {
    label: 'ONFAILURE',
    image: statusFailure
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

export const getBrickStatus = (state) => (
  find(enumBrickStatus, { label: state }) || {
    label: 'DEFAULT',
    image: statusDefault
  }
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
