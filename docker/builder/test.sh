#!/bin/bash
set -euo pipefail

npm run clean
NODE_ENV=development npm i
npm run build:prod
npm run lint
npm test
