/* eslint-env commonjs */

import 'core-js';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import '../src/init/DOMParserShim';
import initI18n from '../src/init/initI18n';

initI18n();

const testsContext = require.context('./unit');
testsContext.keys().forEach(testsContext);
