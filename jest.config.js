/* eslint-env node */
/* eslint-disable import/no-commonjs */

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '@factories/(.*)$': '<rootDir>/__factories__/$1',
    '\\.(html|svg)': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/bower_components/'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  setupFilesAfterEnv: ['jest-extended'],
};
