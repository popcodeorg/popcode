/* eslint-env commonjs */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/no-unassigned-import */
/* eslint-disable import/unambiguous */

import 'babel-polyfill';
import 'es6-set/implement';
import 'whatwg-fetch';
import '../src/init/DOMParserShim';
import initI18n from '../src/util/initI18n';

initI18n();

const testsContext = require.context('./unit');
testsContext.keys().forEach(testsContext);
