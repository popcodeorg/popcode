/* eslint-env commonjs */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */

import '../src/init';
import '../src/validations/linters';
import initI18n from '../src/util/initI18n';

initI18n();

const testsContext = require.context('./unit');
testsContext.keys().forEach(testsContext);
