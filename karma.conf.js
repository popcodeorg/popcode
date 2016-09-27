/* eslint-env node */
/* eslint-disable no-var, object-shorthand */

var assign = require('lodash/assign');
var webpackConfiguration = require('./webpack.config.js');
var isCi = Boolean(process.env.TRAVIS);
var customBrowsers = [
  'Chrome',
  'ChromeCanary',
  'Firefox',
  'Safari',
  'PhantomJS',
];
if (isCi) {
  customBrowsers = ['Firefox', 'PhantomJS'];
}

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: [
      'mocha',
      'chai-as-promised',
      'sinon-chai',
    ],

    files: [
      'spec/index.js',
    ],

    preprocessors: {
      'spec/index.js': ['webpack', 'sourcemap'],
    },

    webpack: assign({}, webpackConfiguration, {
      entry: null,
      devtool: 'inline-source-map',
    }),

    webpackMiddleware: {
      stats: 'errors-only',
    },

    mochaReporter: {
      output: isCi ? 'mocha' : 'autowatch',
      showDiff: true,
    },

    reporters: ['mocha'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_WARN,

    browsers: customBrowsers,

    concurrency: Infinity,
  });
};
