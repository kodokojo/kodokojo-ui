#!/bin/bash
set -euo pipefail

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
cd docker/delivery
test -d ./static/ && rm -rf ./static/
mkdir static
tar zxvf target/kodokojo-ui-${KODOKOJO_UI_VERSION}.tar.gz -C static
cd ../..
docker build --no-cache -t="kodokojo/kodokojo-ui" docker/delivery
