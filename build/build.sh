#!/bin/sh

set -ex

docker run \
    --name popcode-build \
    --env NODE_ENV=production \
    --env FIREBASE_APP \
    --env FIREBASE_APP_ID \
    --env FIREBASE_API_KEY \
    --env FIREBASE_CLIENT_ID \
    --env FIREBASE_MEASUREMENT_ID \
    --env FIREBASE_PROJECT_ID \
    --env GIT_REVISION="$CIRCLE_SHA1" \
    --env MIXPANEL_TOKEN \
    popcode \
    yarn run gulp build

docker cp popcode-build:/app/dist ./

docker rm popcode-build
