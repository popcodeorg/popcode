#!/bin/sh

set -ex

docker run --rm --env NODE_ENV=test popcode yarn test
