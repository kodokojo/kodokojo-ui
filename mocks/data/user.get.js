/* eslint-disable quotes */
/* eslint-disable max-len */

var uuid  = require('uuid')

exports.controller = function(req, res, next) {
  console.log('user GET authorization')

  var userId = uuid.v4()
  var userCredentials = req.headers ? req.headers.authorization : undefined


  var user = {
    "identifier": `${userId}`,
    "entityIdentifier": "15c850471f3add8a0dd937fda85ef0fe27519481",
    "firstName": "jpthiery",
    "lastName": "jpthiery",
    "name": "jpthiery jpthiery",
    "username": "jpthiery",
    "email": "jpthiery@xebia.fr",
    "password": "",
    "sshPublicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDYji20blJoetQ7BLDEeRzmf3i49fQDCGSWrTF/i8ANiJufVOs7Q8Ce4+JXuTmQD4Kol7LaKmc7ObhZN8w7PrAd2HM8PqQQaVIww+hlmTXJDWpSMwl5+RyT/wWzO8n+F+F3ZiAL+IqqkAn3G5Q4Aw7lN65geceD57yrMJ9C3xedafHDHEQIuD34ACCbhp53ZXFpBMryDrRmMiYhUloxN0iYcgeYzG3AxXEYLaxp4hr74rEeJ1CRYArE/Z8cT3iyQ4/+oAZHfWq9Mc8ZKHMLz3lK3IkhDNE2Y4eFE/n1YEaw0h/uwCfo0mR6LX8pt7mJmHEjbdf8rHVXH4N4BZ7szMfp jpthiery@xebia.fr",
    "projectConfigurationIds": [
      {
        "projectConfigurationId": "1e25e0ca2fc382f332be16f1342d152eacedb434",
        "projectId": "b1392a68c1ea01d1e445f9464351f67af86c5e14"
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
      // FIXME fail case doesn't work
      console.log('401 Unauthorized')
      res.contentType = 'application/json'
      res.send(401)
      next()
    }
  }
}
