/* eslint-env mocha */
import Immutable from 'immutable';
import '../../helper';
import {
  assertFailsValidationWith,
  assertPassesValidation,
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

  it('should fail invalid global when there is not <script> tag in the html', () => {
  	assertFailsValidationWith(javascript, `TinyTurtle.whatever();`, 'declare-variable');
  });

  it('should pass invalid global when there W117 has been disabled because there is a <script> tag in the html', () => {
  	const validationOverrides = new Immutable.Map({
  		javascript: new Immutable.Map({
  			enabled: true
  		})
  	})
  	assertPassesValidation(javascript, `TinyTurtle.whatever();`, [ [], validationOverrides]);
  });

});
