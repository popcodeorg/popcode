/* eslint-env mocha */

import '../../helper';
import {
  assertPassesValidation,
  assertFailsValidationWith,
  assertFailsValidationAtLine,
} from '../../assertions/validations';

import css from '../../../src/validations/css';

describe('css', () => {
  it('allows valid flexbox', () =>
    assertPassesValidation(css, `
      .flex-container {
        display: flex;
        flex-flow: nowrap column;
        align-content: flex-end;
        justify-content: flex-start;
        align-items: center;
      }
      .flex-item {
        flex: 1 0 auto;
        align-self: flex-end;
        order: 2;
      }
    `)
  );

  it('fails with bogus flex value', () =>
    assertFailsValidationWith(
      css,
      '.flex-item { flex: bogus; }',
      'invalid-value'
    )
  );

  context('missing semicolon', () => {
    const stylesheet = `
      p {
        margin: 10px
        padding: 5px;
      }
    `;

    it('gives missing semicolon error', () =>
      assertFailsValidationWith(css, stylesheet, 'missing-semicolon')
    );

    it('fails at the line missing the semicolon', () =>
      assertFailsValidationAtLine(css, stylesheet, 2)
    );
  });

  context('extra tokens after value', () => {
    const stylesheet = `
      p {
        padding: 5px 5px 5px 5px 5px;
      }
    `;

    it('gives extra tokens error', () =>
      assertFailsValidationWith(css, stylesheet, 'extra-tokens-after-value')
    );

    it('fails at the line missing the semicolon', () =>
      assertFailsValidationAtLine(css, stylesheet, 2)
    );
  });
});

