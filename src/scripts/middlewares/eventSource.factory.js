// for IE / Edge users
import 'eventsource-polyfill'

const eventSourceFactory = (config) => new EventSource(config) 

export default eventSourceFactory