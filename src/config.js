/* global process */

const nodeEnv = (process.env.NODE_ENV || 'development');

export default {
  nodeEnv,
  logReduxActions: () => process.env.LOG_REDUX_ACTIONS === 'true',
  warnOnDroppedErrors: nodeEnv === 'development',
  stubSVGs: nodeEnv === 'test',

  firebaseApp: process.env.FIREBASE_APP || 'blistering-inferno-9896',

  feedbackUrl: 'https://gitreports.com/issue/popcodeorg/popcode',

  bugsnagApiKey: '400134511e506b91ae6c24ac962af962',

  gitRevision: process.env.GIT_REVISION,
};
