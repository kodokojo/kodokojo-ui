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
 * mapping for account
 *
 * @param data
 * @returns {object} account {id {string}, name {string}, userName {string}, email {string}, password {string}, sshKeyPublic {string}, sshKeyPrivate {string}}
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
    entityId: data.entityIdentifier,
    projectConfigIds: data.projectConfigurationIds ?
      data.projectConfigurationIds.map(projectConfigId => mappingService.mapProjectConfigId(projectConfigId)) :
      undefined
  }
)

/**
 * mapping for "project config id"
 * @param data
 * @returns {object} {projectConfigurationId {string}, projectId {string}}
 */
mappingService.mapProjectConfigId = (data) => (
  {
    projectConfigId: data.projectConfigurationId,
    projectId: data.projectId
  }
)

/**
 * mapping for user
 *
 * @param data
 * @returns {object} user {id {string}, firstName {string}, lastName {string}, name {string}, userName {string}, email {string}}
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
 * mapping for user to backend
 * 
 * @param data
 * @returns {object} user {identifier {string}, firstName {string}, lastName {string}, name {string}, userName {string}, email {string}}
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
    sshPublicKey: data.sshKeyPublic
  }
)

/**
 * mapping for stack
 *
 * @returns {object} stack {type {string}, name {string}, bricks {array}<brick>}
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
 * mapping for brick
 *
 * @returns {object} brick {type {string}, name {string}, state {string}, url {string}}
 */
mappingService.mapBrick = (data) => {
  if (data.type !== 'LOADBALANCER') {
    return {
      type: data.type || data.brickType,
      name: data.name || data.brickName,
      state: data.state,
      version: data.version,
      url: data.url
    }
  }
  return undefined
}

/**
 * mapping for project config
 *
 * @param data
 * @returns {object} projectConfig {id {string}, name {string}, admins {user}, stacks: {array}<stack>, users: {array}<user>}
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
 * mapping for project
 *
 * @param data
 * @returns {object} project {id {string}, projectConfigId {string}, name {string}, updateDate {string}, stacks: {array}<stack>}
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
 * mapping for brick event from websocket
 *
 * @param data
 * @returns {object} brick event {entity {string}, action {string}, data {projectConfigurationId {string}, brickType {string}, brickName {string}, brickState: (string|undefined), brickUrl: (string|undefined)}}
 */
mappingService.mapBrickEvent = (data) => (
  {
    entity: data.entity, // type event
    action: data.action,
    brick: mappingService.mapBrick(data.data)
  }
)

/**
 * mapping for brick list
 *
 * @param {array} data
 * @returns {object} brick list {bricks {array}} list of brick object
 */
mappingService.mapBricksDetails = (data) => (
  {
    bricks: data.length ? mappingService.reorderBricks(data) : []
  }
)

/**
 * reorder bricks
 *
 * @param data
 * @returns {array} ordered array of bricks (SCM / CI / REPOSITORY)
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
 * group bricks by type
 *
 * @param data
 * @returns {object} filtered bricks and grouped by type
 */
mappingService.groupBricks = (data) => {
  const bricks = data.map(brick => mappingService.mapBrick(brick)).filter(brick => brick !== undefined)
  return groupBy(bricks, 'type')
}


// public API
export const mapAccount = mappingService.mapAccount
export const mapUser = mappingService.mapUser
export const mapUserOutput = mappingService.mapUserOutput
export const mapProject = mappingService.mapProject
export const mapProjectConfig = mappingService.mapProjectConfig
export const mapProjectConfigId = mappingService.mapProjectConfigId
export const mapBrickEvent = mappingService.mapBrickEvent
export const mapBricksDetails = mappingService.mapBricksDetails

export default mappingService
