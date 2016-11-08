/* eslint-disable quotes */

exports.controller = function(req, res, next) {
  console.log('call to project POST', req.params)

  var projectConfigId = req.params.id

  var projectId
  if (projectConfigId === '000-stackstate-projectConfigId') {
    projectId = '000-stackstate-projectId'
  } else {
    projectId = '59e860b31588a0a1f2ae3fa75764ce133a6985e3'
  }

  res.contentType = 'application/json'
  res.send(200, projectId)
  next()
}