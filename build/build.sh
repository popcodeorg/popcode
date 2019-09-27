#!/bin/sh

set -ex

docker run \
    --rm \
    --env NODE_ENV=production \
    --env FIREBASE_APP \
    --env FIREBASE_APP_ID \
    --env FIREBASE_API_KEY \
    --env FIREBASE_CLIENT_ID \
    --env FIREBASE_PROJECT_ID \
    --env GIT_REVISION="$TRAVIS_COMMIT" \
    --env GOOGLE_ANALYTICS_TRACKING_ID \
    --volume="$TRAVIS_BUILD_DIR/dist:/app/dist" \
    popcode \
    yarn run gulp build
