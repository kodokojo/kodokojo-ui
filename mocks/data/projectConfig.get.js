/* eslint-disable quotes */

const uuid = require('uuid')
var callCount = 0

exports.controller = function(req, res, next) {
  console.log('call count', callCount++)
  const projectConfig = {
    "identifier":`${req.id}`,
    "name":"Acme",
    "admins": [
      {
        "identifier":"61e8209320eb5c1257e992db84bffe7e14cc7eb1",
        "username":"jpthiery"
      }
    ],
    "users": [
      {
        "identifier":"61e8209320eb5c1257e992db84bffe7e14cc7eb1",
        "username":"jpthiery"
      }
    ],
    "stackConfigs": [
      {
        "name":"build-A",
        "type":"BUILD",
        "brickConfigs": [
          {
            "name": "nexus",
            "type": "REPOSITORY",
            "version": "2.13"
          },
          {
            "name":"jenkins",
            "type":"CI",
            "version": "1.651"
          },
          {
            "name":"gitlab",
            "type":"SCM",
            "version": "8.5.2-ce"
          },
          {
            "name":"haproxy",
            "type":"LOADBALANCER",
            "version": "1.6"
          }
        ]
      }
    ]
  }
  
  if (callCount > 1) {
    var usersIterator = callCount - 1
    for (var i = usersIterator; i > 0; i--) {
      projectConfig.users.push(
        {
          "identifier":`${uuid.v4()}`,
          "username":"jpthiery"
        }
      ) 
    }
  }

  res.contentType = 'application/json'
  res.send(200, JSON.stringify(projectConfig))
  next()
}