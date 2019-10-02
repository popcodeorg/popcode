/* eslint-env node */
/* eslint-disable import/no-commonjs */

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '@factories/(.*)$': '<rootDir>/__factories__/$1',
    '\\.(html|svg)': '<rootDir>/__mocks__/fileMock.js',
    i18next: '<rootDir>/__mocks__/i18next.js',
  },
  testMatch: ['**/__tests__/**/*.test.js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/bower_components/', '/nodeenv/'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  setupFilesAfterEnv: ['jest-extended', './jest-setup.js'],
  testEnvironmentOptions: {
    // includeNodeLocations preserves the location info produced by the HTML
    // parser, allowing you to retrieve it with the nodeLocation() method
    // (described below). It also ensures that line numbers reported in
    // exception stack traces for code running inside <script> elements are
    // correct. It defaults to false to give the best performance, and cannot
    // be used with an XML content type since our XML parser does not support
    // location info.
    includeNodeLocations: true,
  },
};
