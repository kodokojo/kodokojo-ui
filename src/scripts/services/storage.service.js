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

// TODO test scope value, set it to locale if other than session por locale
const storageService = {}

storageService.put = (key, value, scope = 'local') => window[`${scope}Storage`].setItem(key, value)

storageService.get = (key, scope = 'local') => {
  const value = window[`${scope}Storage`].getItem(key)
  return value !== null && value !== 'null' ? value : undefined
}

storageService.remove = (key, scope = 'local') => window[`${scope}Storage`].removeItem(key)

storageService.clear = (scope = 'local') => window[`${scope}Storage`].clear()

// TODO UT
storageService.clean = () => {
  storageService.remove('projectConfigId', 'local')
  storageService.remove('projectId', 'local')
}

// public API
export const put = storageService.put
export const get = storageService.get
export const remove = storageService.remove
export const clear = storageService.clear
export const clean = storageService.clean

export default storageService
