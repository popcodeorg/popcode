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

const currentProject = new Immutable.Map({
  sources: new Immutable.Map({
    html: ''
  })
});
const analyzer = new Analyzer(currentProject);

describe('javascript', () => {
  it('should handle invalid LHS error followed by comment', () =>
    assertFailsValidationWithValidatorArgs(javascript, `alert(--"str"
// comment`,
      [[], analyzer],
      'invalid-left-hand-string',
      'missing-token'
    )
  );
  assertPassesAcceptance(javascript, 'javascript', ['jquery'], analyzer);

  it('should fail invalid global when there is not <script> tag in the html', () => {
  	assertFailsValidationWithValidatorArgs(javascript, `TinyTurtle.whatever();`, [[], analyzer], 'declare-variable');
  });

  it('should pass invalid global when there W117 has been disabled because there is a <script> tag in the html', () => {
    const projectWithScriptTag = new Immutable.Map({
      sources: new Immutable.Map({
        html: '<script src="whatever"></script>'
      })
    });
    const analyzerWithScriptTag = new Analyzer(projectWithScriptTag);
  	assertPassesValidation(javascript, `TinyTurtle.whatever();`, [ [], analyzerWithScriptTag]);
  });

});
