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

import storageService from '../services/storage.service'

export default function persistenceHandler(next) {
  return (reducer, initialState) => {
    const store = next(reducer, initialState)

    return Object.assign({}, store, {
      dispatch(action) {
        store.dispatch(action)

        const storeState = store.getState()

        if (storeState) {
          if (storeState.prefs) {
            storageService.put('locale', storeState.prefs.locale)
            storageService.put('theme', storeState.prefs.theme)
            storageService.put('navigation', storeState.prefs.navigation)
          }
          if (
            storeState.context &&
            storeState.context.organisation &&
            storeState.context.organisation.id
          ) {
            const organisationId = storeState.context.organisation.id
            const organisationName = storeState.context.organisation.name
            if (organisationId) {
              storageService.put('organisationId', organisationId)
              storageService.put('organisationName', organisationName)
              const projectConfigId = storeState.context.projectConfig.id
              const projectConfigName = storeState.context.projectConfig.name
              if (projectConfigId) {
                storageService.put('projectConfigId', projectConfigId)
                storageService.put('projectConfigName', projectConfigName)
              }
              const projectId = storeState.context.project.id
              if (projectId) {
                storageService.put('projectId', projectId)
              }
            } else {
              storageService.remove('OrganisationId')
              storageService.remove('OrganisationName')
              storageService.remove('projectConfigId')
              storageService.remove('projectConfigName')
              storageService.remove('projectId')
            }
          }
        }

        return action
      }
    })
  }
}
