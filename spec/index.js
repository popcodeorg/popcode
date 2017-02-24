/* eslint-env commonjs */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */

const testsContext = require.context('./examples');
testsContext.keys().forEach(testsContext);
