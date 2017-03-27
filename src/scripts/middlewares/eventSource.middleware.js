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

import authService from '../services/auth.service'
import api from '../commons/config'
import eventSourceFactory from './eventSource.factory'
import { mapBrickEvent } from '../services/mapping.service'
import { updateProject } from '../components/project/project.actions'
import {
  eventSuccess,
  eventFailure
} from '../components/event/event.actions'
import {
  EVENT_REQUEST,
  EVENT_STOP
} from '../commons/constants'

// middleware state
let eventSource
let eventSourceConfig

export const eventSourceInit = () => {
  const apiProtocol = `${window.location.protocol}//`
  const apiHost =  window.location.host
  const basicAuth = authService.getBasicAuth()

  if (eventSource) {
    eventSourceClear()
  }

  return {
    basicAuth,
    url: `${apiProtocol}${basicAuth}@${apiHost}${api.event}`,
    readyState: undefined
  }
}

export const eventSourceClear = () => {
  eventSource = undefined
}

const eventSourceMiddleware = store => next => action => {
  const currentAuth = authService.getBasicAuth()

  if (!eventSourceConfig || eventSourceConfig.basicAuth !== currentAuth) {
    eventSourceConfig = eventSourceInit()
  }

  switch (action.type) {
    case EVENT_REQUEST:
      if (!eventSource) {
        eventSource = eventSourceFactory(eventSourceConfig.url)

        // register on open callback
        eventSource.onopen = () => {
          store.dispatch(eventSuccess())
        }

        // register on message callback
        eventSource.onmessage = (event) => {
          const eventData = JSON.parse(event.data)

          if (eventData.headers && eventData.headers.eventType === 'brick_state_update') {
            const mappedEvent = mapBrickEvent(eventData)
            console.log('event source message', mappedEvent) // eslint-disable-line no-console
            store.dispatch(updateProject(mappedEvent))
          }
        }

        // register on error callback
        eventSource.onerror = (event) => {
          console.log('event source error', event) // eslint-disable-line no-console
          store.dispatch(eventFailure(event))
        }
      }
      return next(action)

    case EVENT_STOP:
      eventSourceClear()
      return next(action)

    default:
      return next(action)
  }
}

export default eventSourceMiddleware
