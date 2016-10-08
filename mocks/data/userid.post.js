const uuid = require('uuid')

exports.controller = function(req, res, next) {
  res.contentType = 'application/json'
  res.send(200, uuid.v4())
  next()
}