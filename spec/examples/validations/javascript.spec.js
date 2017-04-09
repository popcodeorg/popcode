/* eslint-env mocha */
import '../../helper';
import {
  assertFailsValidation,
  assertPassesValidation,
} from '../../assertions/validations';

import javascript from '../../../src/validations/javascript';
import assertPassesAcceptance from './assertPassesAcceptance';

const analyzer = {
  enabledLibraries: [],
  containsExternalScript: false,
};

const analyzerWithjQuery = {
  enabledLibraries: ['jquery'],
  containsExternalScript: false,
};

const analyzerWithExternalScript = {
  enabledLibraries: [],
  containsExternalScript: true,
};

describe('javascript', () => {
  it('should handle invalid LHS error followed by comment', () =>
    assertFailsValidation(javascript, `alert(--"str"
// comment`,
      {
        validatorArgs: [analyzer],
        reasons: ['invalid-left-hand-string',
          'missing-token'],
      },
    ),
  );
  assertPassesAcceptance(javascript, 'javascript', analyzerWithjQuery);

  it('should fail when there is not <script> tag in the html', () => {
    assertFailsValidation(javascript,
      'TinyTurtle.whatever();',
      {validatorArgs: [analyzer], reasons: ['declare-variable']});
  });

  it('should pass when W117 has been disabled', () => {
    assertPassesValidation(javascript,
      'TinyTurtle.whatever();',
      [analyzerWithExternalScript]);
  });

  it('should pass when a function is used before it is declared', () => {
    assertPassesValidation(javascript,
        `myFunction();
        function myFunction() {
            return true;   
        }`,
      [analyzer]);
  });
});
