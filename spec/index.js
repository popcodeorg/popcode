/* eslint-env commonjs */

const testsContext = require.context('./examples');
testsContext.keys().forEach(testsContext);
