/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable no-console */

var callCount = 0

exports.controller = function(req, res, next) {
  console.log('call count to user POST', callCount++)

  var userEmail = req.body.email
  var userId

  if (userEmail === '428@error.io') {
    res.contentType = 'application/json'
    console.log('return code 428')
    res.send(428)
    next()
  } else if (userEmail === '409@error.io') {
    res.contentType = 'application/json'
    console.log('return code 409')
    res.send(409)
    next()
  } else if (userEmail === '412@error.io') {
    res.contentType = 'application/json'
    console.log('return code 412')
    res.send(412)
    next()
  } else if (userEmail === '401@error.io') {
    res.contentType = 'application/json'
    console.log('return code 401')
    res.send(401)
    next()
  } else if (userEmail === 'sass-sandbox@new.io') {
    console.log('return code 202')
    res.contentType = 'application/json'
    res.send(202)
    next()
  } else {
    if (callCount > 1) {
      userId = req.params.id
    } else {
      userId = '61e8209320eb5c1257e992db84bffe7e14cc7eb1'
    }

    const firstUser = {
      "identifier": `${userId}`,
      "firstName": "aletaxin",
      "lastName": "aletaxin",
      "name": "aletaxin aletaxin",
      "username": "aletaxin",
      "email": `${userEmail}`,
      "sshPublicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCByUQOuejQKtvuSg/ytTcWOo+OqqMcSBIPqDziAIy23cFt6LDFwEcdDT0XiCABQZcmK5KsoaZscMOzcftVGopfbAcAnRqIYHjuW0elUloAbJ/D97Cyiy1PNJFe2W3ac7Ugl77xjEtojzkJVH3MwcQtwphEF9XGjOOrDW0MgejBGRh4rIJTBbvPbcrmdR/dKpLVwM/Ci7fO13SAnCK0yTh98///XHIKxstNlHFaLYgQmcxbK8WnbJIKXY1kryY0vlUumixVny044qvMWvtgdqcbgQMH9XV18+9h+QZ4ZBWzu3GYtOS+SSISysFNZM3G0G32+2CeGVyu2CqrtwLcqsn3 aletaxin@kodokojo.io",
      "password": "h8kiu45qb8iq4p820iqs4q54is",
      "organisations": [
        {
          "identifier": "c860ff4c56ecc3cf4085d065d2d1b92df302d4b4",
          "name": "aletaxin@kodokojo.io",
          "right": "USER",
          "projectConfigurations": []
        }
      ]
    }

    res.contentType = 'application/json'
    res.send(201, firstUser)
    next()
  }
}
