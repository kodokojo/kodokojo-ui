#!/bin/bash


tar -cvzf /target/kodokojo-ui-${KODOKOJO_UI_VERSION}.tar.gz -C /src/static/ .
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
