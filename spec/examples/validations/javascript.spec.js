/* eslint-env mocha */
import Immutable from 'immutable';
import '../../helper';
import {
  assertFailsValidationWithValidatorArgs,
  assertPassesValidation,
} from '../../assertions/validations';

import javascript from '../../../src/validations/javascript';
import assertPassesAcceptance from './assertPassesAcceptance';
import Analyzer from '../../../src/analyzers';

const analyzer = {
  enabledLibraries: [],
  containsExternalScript: false,
};

const analyzerWithjQuery = {
  enabledLibraries: ['jquery'],
  containsExternalScript: false
};

const analyzerWithExternalScript = {
  enabledLibraries: [],
  containsExternalScript: true,
};

describe('javascript', () => {
  it('should handle invalid LHS error followed by comment', () =>
    assertFailsValidationWithValidatorArgs(javascript, `alert(--"str"
// comment`,
      [analyzer],
      'invalid-left-hand-string',
      'missing-token'
    )
  );
  assertPassesAcceptance(javascript, 'javascript', analyzerWithjQuery);

  it('should fail invalid global when there is not <script> tag in the html', () => {
  	assertFailsValidationWithValidatorArgs(javascript, `TinyTurtle.whatever();`, [analyzer], 'declare-variable');
  });

  it('should pass invalid global when there W117 has been disabled because there is a <script> tag in the html', () => {
  	assertPassesValidation(javascript, `TinyTurtle.whatever();`, [ analyzerWithExternalScript ]);
  });

});
