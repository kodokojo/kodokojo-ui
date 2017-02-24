#!/bin/bash
set -euo pipefail

tar -cvzf "/target/kodokojo-ui-${KODOKOJO_UI_VERSION}.tar.gz" -C /src/static/ .
