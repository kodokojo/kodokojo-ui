#!/bin/bash

npm run clean
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
NODE_ENV=development npm i
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
npm run build:prod
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
npm run lint
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
npm test
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
tar -cvzf /target/kodokojo-ui-${KODOKOJO_UI_VERSION}.tar.gz -C /src/static/ .
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
