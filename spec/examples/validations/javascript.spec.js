/* eslint-env mocha */

import '../../helper';

import javascript from '../../../src/validations/javascript';
import assertPassesAcceptance from './assertPassesAcceptance';

describe('javascript', () => {
  assertPassesAcceptance(javascript, 'javascript', ['jquery']);
});
