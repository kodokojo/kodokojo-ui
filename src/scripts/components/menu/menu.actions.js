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

import findKey from 'lodash/findKey'
import filter from 'lodash/filter'
import cloneDeep from 'lodash/cloneDeep'
import {
  MENU_UPDATE
} from '../../commons/constants'

import { getMenu } from '../../services/param.service'

export function updateMenu(menu) {
  return {
    type: MENU_UPDATE,
    menu
  }
}

export function updateMenuProject(projectName) {
  return (dispatch, getState) => {
    const nextMenu = cloneDeep(getState().menu)

    if (nextMenu['project']) {
      nextMenu['project'].labelText = projectName
      nextMenu['project'].titleText = projectName
      return dispatch(updateMenu(nextMenu))
    }

    return Promise.resolve()
  }
}

export function updateMenuPath(path) {
  return dispatch => {
    let nextMenu = cloneDeep(getMenu())

    // active menu item
    const selectedKey = findKey(nextMenu, { route: path })

    // inactive all menu items
    const menuItems = Object.keys(nextMenu)
    menuItems.forEach((key) => {
      if (nextMenu[key].active !== undefined) {
        nextMenu[key].active = false
      }
    })

    if (selectedKey) {
      const nextMenuSelectedItem = nextMenu[selectedKey]
      nextMenuSelectedItem.active = true

      // if selected menu is level 0, remove all other menu items
      if (nextMenuSelectedItem.level === 0) {
        nextMenu = filter(nextMenu, (menuItem) => menuItem.level === 0)
      }
    }

    return dispatch(updateMenu(nextMenu))
  }
}
