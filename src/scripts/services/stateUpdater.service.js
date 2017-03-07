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

import cloneDeep from 'lodash/cloneDeep'
import findIndex from 'lodash/findIndex'
import difference from 'lodash/difference'
import map from 'lodash/map'

import { getStatusByState, getStatusByOrder } from './param.service'

const stateUpdaterService = {}

/**
 * Update bricks, merge previous state with partial state
 *
 * @param prevBricks
 * @param bricks
 * @returns {array} bricks updated
 */
stateUpdaterService.updateBricks = (prevBricks, bricks) => {
  const nextBricks = cloneDeep(prevBricks)
  if (bricks.length > 0) {
    bricks.forEach(brick => {
      if (brick) {
        const prevBrickIndex = findIndex(prevBricks, { name: brick.name })
        nextBricks[prevBrickIndex] = {
          ...prevBricks[prevBrickIndex],
          ...brick
        }
      }
    })
  }
  return nextBricks
}

/**
 * Aggregate brick states for a given stack
 *
 * @param bricks
 * @returns {object} status
 */
stateUpdaterService.computeAggregatedStackStatus = (bricks) => {
  if (bricks.length > 1) {
    const stateOrder = bricks.reduce((previous, brick) => {
      // if there is no previous state, we use Infinity so current state order will became the reference for the next iteration
      const previousStateOrder = previous.state ? getStatusByState(previous.state).order : Infinity
      const currentStateOrder = getStatusByState(brick.state).order
      return Math.min(previousStateOrder, currentStateOrder)
    })
    return getStatusByOrder(stateOrder)
  } else if (bricks.length === 1) {
    return getStatusByState(bricks[0].state)
  }
  return getStatusByState('DEFAULT')
}

/**
 * Return new array without users to delete
 *
 * @param {array} prevUsers
 * @param {array} usersToDelete
 * @returns {array} users
 */
stateUpdaterService.removeUsers = (prevUsers, usersToDelete) => {
  if (usersToDelete.length > 0) {
    const nextUsers = cloneDeep(prevUsers)
    return difference(nextUsers, usersToDelete)
  }
  return prevUsers
}

/**
 * Filter checked members object, return array
 *
 * @param {object} members
 * @returns {array} checked members
 */
stateUpdaterService.filterCheckedMembers = (members) => map(members, (user, key) => {
  if (user.checked) {
    return key
  }
  return null
}).filter((item) => item !== null)

// public API
export const updateBricks = stateUpdaterService.updateBricks
export const computeAggregatedStackStatus = stateUpdaterService.computeAggregatedStackStatus
export const removeUsers = stateUpdaterService.removeUsers
export const filterCheckedMembers = stateUpdaterService.filterCheckedMembers

export default stateUpdaterService
