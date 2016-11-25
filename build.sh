#!/bin/bash

# save package version in env variable
export KODOKOJO_UI_VERSION=$(npm version --json | jq -r '."kodokojo-ui"')

cp config/config.template.tpl docker/delivery/config.template.tpl
docker build --no-cache -t="kodokojo/kodokojo-ui:builder" docker/builder/
containerId=$(docker create -e "KODOKOJO_UI_VERSION=${KODOKOJO_UI_VERSION}" kodokojo/kodokojo-ui:builder)
docker cp $(pwd)/. ${containerId}:/src/
docker start -a $containerId
docker cp ${containerId}:/target/ $(pwd)/docker/delivery/
rc=$(docker inspect -f {{.State.ExitCode}} $containerId)
docker rm $containerId
if [ "$rc" != 0 ]; then
  exit $rc
fi
cd docker/delivery
mkdir static
tar zxvf target/kodokojo-ui-${KODOKOJO_UI_VERSION}.tar.gz -C static
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
cd ../..
docker build --no-cache -t="kodokojo/kodokojo-ui" docker/delivery
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
