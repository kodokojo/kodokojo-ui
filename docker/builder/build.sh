#!/bin/bash

/test.sh
rc=$?
if [ "$rc" != 0 ]; then
  exit $rc
fi
/makeTar.sh
