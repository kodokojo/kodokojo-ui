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

import toArray from 'lodash/toArray'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'

const mappingService = {}

/**
 * Mapping for account
 *
 * @param {Object} data
 * @returns {Object} account
 */
mappingService.mapAccount = (data) => (
  {
    id: data.identifier,
    name: data.name,
    userName: data.username,
    email: data.email,
    password: data.password,
    sshKeyPublic: data.sshPublicKey,
    sshKeyPrivate: data.privateKey,
    isRoot: data.isRoot || false,
    organisations: data.organisations ?
      data.organisations.map(organisation => mappingService.mapOrganisation(organisation)) :
      []
  }
)

/**
 * Mapping for organisation
 *
 * @param {Object} data
 * @returns {Object} organisation
 */
mappingService.mapOrganisation = (data) => (
  {
    id: data.identifier,
    name: data.name,
    group: data.right,
    usersNumber: data.nbUserTotal,
    projectConfigsNumber: data.nbProjectTotal,
    projectConfigs: data.projectConfigurations ?
      data.projectConfigurations.map((projectConfig) => mappingService.mapOrganisationProjectConfig(projectConfig)) :
      []
  }
)

/**
 * Mapping for organisation projectConfig (with user rights)
 *
 * @param {Object} data
 * @returns {Object} organisation
 */
mappingService.mapOrganisationProjectConfig = (data) => (
  {
    id: data.identifier,
    name: data.projectName || data.name || '',
    project: {
      id: data.projectId || undefined,
    },
    isTeamLeader: data.isTeamLeader
  }
)

/**
 * Mapping for user
 *
 * @param {Object} data
 * @returns {Object} user
 */
mappingService.mapUser = (data) => (
  {
    id: data.identifier,
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name,
    userName: data.username,
    email: data.email,
    sshKeyPublic: data.sshPublicKey
  }
)

/**
 * Mapping for user to backend
 * 
 * @param {Object} data
 * @returns {Object} user for backend
 */
mappingService.mapUserOutput = (data) => (
  {
    identifier: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name,
    username: data.userName,
    email: data.email,
    password: data.password,
    sshPublicKey: data.sshKeyPublic,
    isRoot: data.group ? data.group === 'ROOT' : false,
    organisationId: data.organisationId || ''
  }
)

/**
 * Mapping for stack
 *
 * @returns {Object} stack
 */
mappingService.mapStack = (data) => {
  const bricks = data.brickConfigs || data.brickStates || data.brickStateEvents || undefined
  return {
    type: data.type || data.stackType,
    name: data.name,
    bricks: bricks && bricks.length > 0 ?
      flatten(mappingService.reorderBricks(bricks)) :
      []
  }
}

/**
 * Mapping for brick
 *
 * @returns {Object} brick
 */
mappingService.mapBrick = (data) => {
  if (data.type !== 'LOADBALANCER') {
    return {
      projectConfigId: data.projectConfigurationIdentifier,
      stackName: data.stackName,
      type: data.type || data.brickType,
      message: data.message,
      name: data.name || data.brickName,
      state: data.state || data.newState,
      version: data.version,
      url: data.url
    }
  }
  return undefined
}

/**
 * Mapping for project config
 *
 * @param {Object} data
 * @returns {Object} projectConfig
 */
mappingService.mapProjectConfig = (data) => (
  {
    id: data.identifier,
    name: data.name,
    admins: data.admins ?
      data.admins.map(admin => admin.identifier) :
      undefined,
    stacks: data.stackConfigs ?
      data.stackConfigs.map(stack => mappingService.mapStack(stack)) :
      undefined,
    users: data.users ?
      data.users.map(user => user.identifier) :
      undefined
  }
)

/**
 * Mapping projectConfig to backend
 *
 * @param {Object} data
 * @returns {Object} projectConfig for backend
 */
mappingService.mapProjectConfigOutput = (data) => (
  {
    name: data.projectConfigName,
    ownerIdentifier: data.projectConfigOwner,
    userIdentifiers: data.projectConfigUsers,
    stackConfigs: [
      data.stackConfiguration
    ],
    organisationIdentifier: data.organisationId // TODO implement in projectconfigform
  }
)

/**
 * Mapping for project
 *
 * @param {Object} data
 * @returns {Object} project
 */
mappingService.mapProject = (data) => (
  {
    id: data.identifier,
    projectConfigId: data.projectConfigurationIdentifier,
    name: data.name,
    updateDate: data.snapshotDate, // TODO convert {string} to date?
    stacks: data.stacks ? data.stacks.map(stack => mappingService.mapStack(stack)) : undefined
  }
)

/**
 * Mapping for brick event from event source
 *
 * @param {Object} data
 * @returns {Object} brick event
 */
mappingService.mapBrickEvent = (data) => (
  {
    eventType: data.headers.eventType,
    brick: mappingService.mapBrick(data.payload)
  }
)

/**
 * Mapping for brick list
 *
 * @param {Array} data
 * @returns {Object} brick list
 */
mappingService.mapBricksDetails = (data) => (
  {
    bricks: data.length ? mappingService.reorderBricks(data) : []
  }
)

/**
 * Reorder bricks
 *
 * @param {Object} data
 * @returns {Array} ordered array of bricks (SCM / CI / REPOSITORY)
 */
mappingService.reorderBricks = (data) => {
  const groupedBricks = mappingService.groupBricks(data)
  return toArray({
    SCM: groupedBricks.SCM,
    CI: groupedBricks.CI,
    REPOSITORY: groupedBricks.REPOSITORY
  }).filter(brick => brick !== undefined)
}

/**
 * Group bricks by type
 *
 * @param {Object} data
 * @returns {Object} filtered bricks and grouped by type
 */
mappingService.groupBricks = (data) => {
  const bricks = data.map(brick => mappingService.mapBrick(brick)).filter(brick => brick !== undefined)
  return groupBy(bricks, 'type')
}


// public API
export const mapAccount = mappingService.mapAccount
export const mapOrganisation = mappingService.mapOrganisation
export const mapOrganisationProjectConfig = mappingService.mapOrganisationProjectConfig
export const mapUser = mappingService.mapUser
export const mapUserOutput = mappingService.mapUserOutput
export const mapProject = mappingService.mapProject
export const mapProjectConfig = mappingService.mapProjectConfig
export const mapProjectConfigOutput = mappingService.mapProjectConfigOutput
export const mapBrickEvent = mappingService.mapBrickEvent
export const mapBricksDetails = mappingService.mapBricksDetails

export default mappingService
