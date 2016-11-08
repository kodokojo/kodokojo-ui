/* eslint-disable quotes */

exports.controller = function(req, res, next) {
  console.log('call to projectConfig POST', req.body)

  var projectName = req.body.name

  var projectConfigId
  if (projectName === 'unknown') {
    projectConfigId = '000-stackstate-projectConfigId'
  } else {
    projectConfigId = '59e860b31588a0a1f2ae3fa75764ce133a6985e3'
  }

  res.contentType = 'application/json'
  res.send(200, projectConfigId)
  next()
}