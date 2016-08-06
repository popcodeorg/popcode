/* eslint-env mocha */

import '../../helper';
import {
  assertPassesValidation,
  assertFailsValidationWith,
} from '../../assertions/validations';

import css from '../../../src/validations/css';

function assertPassesCssValidation(source) {
  return assertPassesValidation(css, source);
}

function assertFailsCssValidationWith(source, ...errors) {
  return assertFailsValidationWith(css, source, ...errors);
}

describe('css', () => {
  it('allows valid flexbox', () =>
    assertPassesCssValidation(`
      .flex-container { display: flex; }
      .flex-item { flex: 1 0 auto; }
    `)
  );

  it('fails with bogus flex value', () =>
    assertFailsCssValidationWith(
      '.flex-item { flex: bogus; }',
      'invalid-value'
    )
  );
});

