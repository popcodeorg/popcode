#!/bin/sh

set -ex

docker pull popcodeorg/popcode:latest
docker build \
    --pull \
    --force-rm \
    --cache-from popcodeorg/popcode:latest \
    --tag popcode \
    .
