/* eslint-env node */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-commonjs */

const isDocker = require('is-docker');
const webpackConfiguration = require('./webpack.config.js');

const isCi = Boolean(process.env.TRAVIS);
const browserStackAvailable = Boolean(process.env.BROWSER_STACK_ACCESS_TOKEN);

const allBrowsers = [
  ['Chrome', '53', 'Windows', '10'],
  ['Firefox', '48', 'Windows', '10'],
  ['IE', '11', 'Windows', '10'],
  ['Chrome', '53', 'OS X', 'Sierra'],
  ['Firefox', '48', 'OS X', 'Sierra'],
];

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap', 'sinon'],

    files: ['test/index.js'],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfiguration('test'),

    reporters: ['dots'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_WARN,

    browsers: ['Chrome'],

    concurrency: Infinity,

    browserConsoleLogOptions: {
      level: config.LOG_WARN,
    },
  });

  if (browserStackAvailable) {
    const customLaunchers = {};
    allBrowsers.forEach((browser) => {
      customLaunchers[`browserStack${browser[0]}${browser[2]}`] = {
        base: 'BrowserStack',
        browser: browser[0],
        browser_version: browser[1], // eslint-disable-line camelcase
        os: browser[2],
        os_version: browser[3], // eslint-disable-line camelcase
      };
    });

    config.set({
      browserStack: {
        username: process.env.BROWSER_STACK_USERNAME,
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      },

      browserNoActivityTimeout: 60000,

      customLaunchers,

      browsers: Reflect.getOwnPropertyNames(customLaunchers),

      reporters: ['dots', 'BrowserStack'],
    });
  } else if (isCi || isDocker()) {
    config.set({
      browsers: ['ChromeHeadlessNoSandbox'],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox'],
        },
      },
    });
  }
};
