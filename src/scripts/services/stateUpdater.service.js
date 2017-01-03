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

// TODO UT
/**
 * Update bricks, merge previous state with partial state
 *
 * @param prevBricks
 * @param bricks
 * @returns {Array} bricks updated
 */
export const updateBricks = (prevBricks, bricks) => {
  const nextBricks = cloneDeep(prevBricks)
  if (bricks.length > []) {
    bricks.forEach(brick => {
      if (brick) {
        const brickIndex = findIndex(prevBricks, { name: brick.name })
        nextBricks[brickIndex] = brick
      }
    })
  }
  return nextBricks
}

// TODO UT
/**
 * Aggregate brick states for a given stack
 *
 * @param bricks
 * @returns {Object} status
 */
export const computeAggregatedStackStatus = (bricks) => {
  if (bricks.length > 1) {
    const stateOrder = bricks.reduce((previous, brick) => {
      const previousStateOrder = previous.state ? getStatusByState(previous.state).order : previous
      const currentStateOrder = getStatusByState(brick.state).order
      return Math.min(previousStateOrder, currentStateOrder)
    })
    return getStatusByOrder(stateOrder)
  } else if (bricks.length === 1) {
    return getStatusByState(bricks[0].state)
  }
  return getStatusByState('DEFAULT')
}

// TODO UT
/**
 * Return new array without users to delete
 *
 * @param {Array} prevUsers
 * @param {Array} usersToDelete
 * @returns {Array} users
 */
export const removeUsers = (prevUsers, usersToDelete) => {
  if (usersToDelete.length > 0) {
    const nextUsers = cloneDeep(prevUsers)
    return difference(nextUsers, usersToDelete)
  }
  return prevUsers
}

// TODO UT
/**
 * Filter checked members object, return array
 *
 * @param {Object} members
 * @returns {Array} checked members
 */
export const filterCheckedMembers = (members) => map(members, (user, key) => {
  if (user.checked) {
    return key
  }
  return null
}).filter((item) => item !== null)
