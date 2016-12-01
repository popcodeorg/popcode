/* eslint-env mocha */

import '../../helper';
import {
  assertFailsValidationWith,
} from '../../assertions/validations';

import javascript from '../../../src/validations/javascript';
import assertPassesAcceptance from './assertPassesAcceptance';

describe('javascript', () => {
  it('should handle invalid LHS error followed by comment', () =>
    assertFailsValidationWith(javascript, `alert(--"str"
// comment`,
      'invalid-left-hand-string',
      'missing-token'
    )
  );
  assertPassesAcceptance(javascript, 'javascript', ['jquery']);
});
