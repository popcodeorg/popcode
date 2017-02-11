/* global process */

import get from 'lodash/get';

const nodeEnv = (process.env.NODE_ENV || 'development');

export default {
  nodeEnv,
  logReduxActions: () => process.env.LOG_REDUX_ACTIONS === 'true',
  warnOnDroppedErrors: process.env.WARN_ON_DROPPED_ERRORS === 'true',

  firebaseApp: get(
    process,
    'env.FIREBASE_APP',
    'popcode-development'
  ),
  firebaseApiKey: get(
    process,
    'env.FIREBASE_API_KEY',
    'AIzaSyCHlo2RhOkRFFh48g779YSZrLwKjoyCcws'
  ),

  feedbackUrl: 'https://gitreports.com/issue/popcodeorg/popcode',

  bugsnagApiKey: '400134511e506b91ae6c24ac962af962',

  gitRevision: process.env.GIT_REVISION,

  googleAnalyticsTrackingId:
    process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'UA-90316486-2',
};
