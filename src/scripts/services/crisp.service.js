const crispService = {
  crisp: undefined
}

crispService.inject = () => {
  const head = document.head || document.getElementsByTagName('head')[0]
  const script = document.createElement('script')
  script.id = 'script-crisp'
  script.src = 'https://client.crisp.im/l.js'
  script.type = 'text/javascript'
  script.async = true
  script.defer = true
  script.onerror = (oError) => {
    throw new URIError(`The script ${oError.target.src} is not accessible.`)
  }
  head.appendChild(script)
}

crispService.init = () => {
  crispService.crisp = window.$crisp
}

crispService.putUser = (account) => {
  if (!crispService.crisp) {
    crispService.init()
  }

  if (account.email) {
    crispService.crisp.set('user:email', account.email)
  }

  if (account.firstName && account.lastName) {
    crispService.crisp.set('user:nickname', `${account.firstName} ${account.lastName}`)
  }
}

crispService.init()

// private API
export const init = crispService.init
export const inject = crispService.inject

// public API
export const putUser = crispService.putUser

export default crispService