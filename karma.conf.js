/* eslint-env node */
/* eslint-disable no-var, object-shorthand */

var isCi = Boolean(process.env.TRAVIS);
var customBrowsers = ['Chrome', 'Firefox', 'Safari', 'PhantomJS'];
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
      'browserify',
    ],

    files: [
      'spec/examples/**/*.spec.js',
    ],

    preprocessors: {
      'spec/examples/**/*.spec.js': ['browserify'],
    },

    browserify: {
      debug: true,
      extensions: ['.js', '.jsx'],
      transform: [
        ['brfs-babel'],
        ['babelify', {presets: ['react', 'es2015']}],
        ['envify'],
      ],
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
