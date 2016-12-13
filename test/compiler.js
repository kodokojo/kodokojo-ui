'use strict'
var babel = require('babel-core/register')({
  // include kodokojo-ui-commons
  ignore: /node_modules(?!\/kodokojo-ui-commons)/
})

// this is to fix error when babel/register import some files type
// see https://github.com/bruderstein/unexpected-react/wiki/Webpack-Loader-issue

function noop() {
  return null
}
require.extensions['.scss'] = noop
require.extensions['.less'] = noop
require.extensions['.css'] = noop
require.extensions['.png'] = noop
require.extensions['.svg'] = noop
require.extensions['.gif'] = noop
require.extensions['.jpg'] = noop
