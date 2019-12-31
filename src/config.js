/* global process */
/* eslint-env commonjs */
/* eslint-disable import/no-commonjs */

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  warnOnDroppedErrors: process.env.WARN_ON_DROPPED_ERRORS === 'true',

  firebaseApp: process.env.FIREBASE_APP,
  firebaseAppId: process.env.FIREBASE_APP_ID,
  firebaseApiKey: process.env.FIREBASE_API_KEY,
  firebaseClientId: process.env.FIREBASE_CLIENT_ID,
  firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,

  feedbackUrl: 'https://gitreports.com/issue/popcodeorg/popcode',

  bugsnagApiKey: '3cc590a735bc2e50d2a21e467cf62fee',

  gitRevision: process.env.GIT_REVISION,

  mixpanelToken: process.env.MIXPANEL_TOKEN,
};
