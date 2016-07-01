#!/bin/bash

# TODO get version from other file, automatically tag when build (replace package.json one)
KODOKOJO_UI_VERSION="0.1.0"

docker build --no-cache -t="kodokojo/kodokojo-ui:builder" docker/builder/
containerId=$(docker create -e "KODOKOJO_UI_VERSION=0.1.0" kodokojo/kodokojo-ui:builder)
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
