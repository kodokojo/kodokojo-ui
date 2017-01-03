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
import cloneDeep from 'lodash/cloneDeep'
import {
  MENU_INIT,
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

    nextMenu[1].labelText = projectName
    nextMenu[1].titleText = projectName
    return dispatch(updateMenu(nextMenu))
  }
}

export function updateMenuPath(path) {
  return (dispatch, getState) => {
    const nextMenu = getState().menu

    // inactive all menu items
    const menuItems = Object.keys(nextMenu)
    menuItems.forEach((key) => {
      if (nextMenu[key].active !== undefined) {
        nextMenu[key].active = false
      }
    })

    // active menu item
    const selectedSubMenu = find(nextMenu, { route: path })
    if (selectedSubMenu) {
      nextMenu[selectedSubMenu.index].active = true

      // if selected menu is root, remove all other menu items
      if (selectedSubMenu.index === 0) {
        filter(nextMenu, (menuItem) => menuItem.index === 0)
      }
    }

    return dispatch(updateMenu(nextMenu))
  }
}

export function initMenuDefault() {
  return {
    type: MENU_INIT,
    menu: getMenu()
  }
}

export function initMenu(location) {
  return dispatch => dispatch(initMenuDefault())
    .then(data => {
      if (location) {
        return dispatch(updateMenuPath(location))
      }
      return Promise.resolve(data)
    })
}
