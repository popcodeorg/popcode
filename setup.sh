#!/bin/bash

export OSX=$(expr $(uname | tr '[:upper:]' '[:lower:]') == "darwin*")

if ! docker-compose -v &> /dev/null
then
    echo "Before running this script, install Docker and Docker Compose."
    if [ -z $OSX ]
    then
        echo "Download the latest community edition here:"
        echo "https://docs.docker.com/docker-for-mac/release-notes/"
    else
        echo "Find installation instructions for your distro here:"
        echo "https://docs.docker.com/install/linux/docker-ce/ubuntu/"
    fi
    exit 1
fi

set -e

if [ -z $OSX ]
then
    echo "Setting up docker-compose to use docker-sync for faster filesystem access on OS X"
    echo "See http://docker-sync.io/ for more information"
    ln -si docker-compose.sync.yml docker-compose.override.yml
else
    echo "Setting up docker-compose to use bind mount configuration for full filesystem access to dependencies"
    ln -si docker-compose.bind.yml docker-compose.override.yml
fi

echo "Building Docker containers. This will take a few minutes…"
docker pull popcodeorg/popcode:latest &>/dev/null
docker-compose up --build --no-start &>/dev/null

echo "Installing dependencies to local filesystem. This will take a few minutes…"
docker-compose run --rm app yarn install --frozen-lockfile &>/dev/null

echo ""
echo "Your development environment is ready! To run your development server, type:"
echo ""
echo "  docker-compose up"
echo ""
echo "To run tests, type:"
echo ""
echo "  bin/yarn test"
