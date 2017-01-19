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

import { getToken } from '../services/auth.service'
import api from '../commons/config'
import apiConf from '../../../config/shared/api.env'
import { getWebSocket } from '../services/webSocket.factory'
import { mapBrickEvent } from '../services/mapping.service'
import { updateProject } from '../components/project/project.actions'
import {
  requestWebsocket,
  successWebsocket,
  failureWebsocket,
  stopWebsocket
} from '../components/_utils/websocket/websocket.actions'
import { logout } from '../components/login/login.actions'
import {
  WEBSOCKET_REQUEST,
  WEBSOCKET_STOP
} from '../commons/constants'

// TODO let the dev backend reroute ws calls through express server

export const websocketInit = () => {
  let apiProtocol
  let apiHost

  if (apiConf.getProtocol() && apiConf.getHost()) {
    apiProtocol = `${apiConf.getProtocol() === 'https://' ? 'wss:' : 'ws:'}//`
    apiHost = apiConf.getHost()
  } else {
    apiProtocol = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//`
    apiHost = `${window.location.host}`
  }

  return {
    retry: 0,
    socket: undefined,
    socketPing: undefined,
    uri: `${apiProtocol}${apiHost}${api.event}`
  }
}

const websocketClean = (ws) => {
  if (ws.socketPing) {
    clearInterval(ws.socketPing)
    ws.socketPing = undefined // eslint-disable-line no-param-reassign
  }
  if (ws.socket) {
    ws.socket.close(1000, 'user <user> living')
    ws.socket = undefined // eslint-disable-line no-param-reassign
  }
}

const ws = websocketInit()

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case WEBSOCKET_REQUEST:
      if (!ws.socket) {
        ws.socket = getWebSocket(ws.uri)

        // register on open callback
        ws.socket.onopen = () => {
          store.dispatch(successWebsocket())
          // authenticate user to approve socket creation
          ws.socket.send(JSON.stringify({
            entity: 'user',
            action: 'authentication',
            data: {
              authorization: `Basic ${getToken()}`
            }
          }))

          // start to ping to keep socket open
          ws.socketPing = setInterval(() => {
            ws.socket.send(JSON.stringify({
              entity: 'ws',
              action: 'ping'
            }))
          }, 60000)
        }

        // register on message callback
        ws.socket.onmessage = (socketEvent) => {
          const socketEventData = JSON.parse(socketEvent.data)

          if (socketEventData.headers && socketEventData.headers.eventType === 'brick_state_update') {
            const mappedEvent = mapBrickEvent(socketEventData)
            console.log('wsMapEvent', mappedEvent) // eslint-disable-line no-console
            store.dispatch(updateProject(mappedEvent))
          }
        }

        // register on error callback
        ws.socket.onerror = (socketEvent) => {
          console.log('wsError', socketEvent) // eslint-disable-line no-console
          store.dispatch(failureWebsocket(socketEvent))
        }

        // register on close callback
        ws.socket.onclose = (socketEvent) => {
          console.log('wsClose', socketEvent) // eslint-disable-line no-console
          websocketClean(ws)
          if (socketEvent.code === 4401) {
            store.dispatch(logout())
          }
          if (ws.retry < 5) {
            ws.retry++
            setTimeout(() => {
              store.dispatch(requestWebsocket())
            }, 2000)
          } else {
            throw new Error('Websocket init reach max retry, closing it.')
          }
        }
      }
      return next(action)
    case WEBSOCKET_STOP:
      websocketClean(ws)
      return next(action)
    // TODO implement SEND_MESSAGE if needed

    default:
      return next(action)
  }
}

export default websocketMiddleware
