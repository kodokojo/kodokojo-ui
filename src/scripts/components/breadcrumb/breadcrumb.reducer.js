import {
  AUTH_RESET,
  BREADCRUMB_INIT,
  BREADCRUMB_UPDATE
} from '../../commons/constants'

const stateDefault = []

// TODO UT
export default function breadcrumb(state = stateDefault, action) {
  if (action.type === BREADCRUMB_INIT || action.type === BREADCRUMB_UPDATE) {
    return action.breadcrumb
  }

  if (action.type === AUTH_RESET) {
    return []
  }

  return state
}
