/* eslint-disable quotes */
/* eslint-disable max-len */

var uuid  = require('uuid')

exports.controller = function(req, res, next) {
  console.log(`user GET authorization`)

  var userId = uuid.v4()
  var userCredentials = req.headers ? req.headers.authorization : undefined

  var user = {
    "identifier": `${userId}`,
    "firstName": "aletaxin",
    "lastName": "aletaxin",
    "name": "aletaxin aletaxin",
    "username": "aletaxin",
    "email": "aletaxin@kodokojo.io",
    "sshPublicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCByUQOuejQKtvuSg/ytTcWOo+OqqMcSBIPqDziAIy23cFt6LDFwEcdDT0XiCABQZcmK5KsoaZscMOzcftVGopfbAcAnRqIYHjuW0elUloAbJ/D97Cyiy1PNJFe2W3ac7Ugl77xjEtojzkJVH3MwcQtwphEF9XGjOOrDW0MgejBGRh4rIJTBbvPbcrmdR/dKpLVwM/Ci7fO13SAnCK0yTh98///XHIKxstNlHFaLYgQmcxbK8WnbJIKXY1kryY0vlUumixVny044qvMWvtgdqcbgQMH9XV18+9h+QZ4ZBWzu3GYtOS+SSISysFNZM3G0G32+2CeGVyu2CqrtwLcqsn3 aletaxin@kodokojo.io",
    "organisations": [
      {
        "identifier": "c860ff4c56ecc3cf4085d065d2d1b92df302d4b4",
        "name": "aletaxin@kodokojo.io",
        "right": "USER",
        "projectConfigurations": []
      }
    ]
  }

  if (userCredentials) {
    var auth = new Buffer(userCredentials.substr(userCredentials.indexOf(' '), userCredentials.length),'base64').toString()
    if (auth.substr(0, auth.indexOf(':')) === 'login') {
      res.contentType = 'application/json'
      res.send(200, user)
      next()
    } else {
      res.contentType = 'application/json'
      console.log('401 Unauthorized')
      res.send(401)
      next()
    }
  }
}
