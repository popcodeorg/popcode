module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '@factories/(.*)$': '<rootDir>/__factories__/$1',
    '\\.(html|svg)': '<rootDir>/__mocks__/fileMock.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/bower_components/'],
  testMatch: ['**/__tests__/**/*.test.js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/bower_components/', '/nodeenv/'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  setupFilesAfterEnv: ['jest-extended', './jest-setup.js'],
};
