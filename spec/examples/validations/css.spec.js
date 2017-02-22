/* eslint-env mocha */

import '../../helper';
import {
  assertPassesValidation,
  assertFailsValidationWith,
  assertFailsValidationAtLine,
} from '../../assertions/validations';
import assertPassesAcceptance from './assertPassesAcceptance';

import css from '../../../src/validations/css';

describe('css', function() {
  this.timeout(10000); // eslint-disable-line no-invalid-this

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

  it('allows valid filter', () =>
    assertPassesValidation(css, `
      img {
        filter: grayscale(100%);
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

  it('fails with bogus filter value', () =>
    assertFailsValidationWith(
      css,
      'img { filter: whitescale(100%); }',
      'invalid-value'
    )
  );

  it('gives a useful error when there is no opening curly brace', () =>
    assertFailsValidationWith(
      css,
      `p
        display: block;`,
      'block-expected'
    )
  );

  it('gives a useful error with no opening curly brace and whitespace', () =>
    assertFailsValidationWith(
      css,
      `p
        display: block;
      `,
      'block-expected'
    )
  );

  it('gives a useful error when there is no closing curly brace', () =>
    assertFailsValidationWith(
      css,
      `p {
        display: block;`,
      'missing-closing-curly'
    )
  );

  it('gives a useful error when there is no semi-colon', () =>
    assertFailsValidationWith(
      css,
      'p { display: block }',
      'missing-semicolon'
    )
  );

  it('gives a useful error when a bogus character is in selector', () =>
    assertFailsValidationWith(
      css,
      'p; div { display: block; }',
      'invalid-token-in-selector'
    )
  );

  it('gives a good error when an invalid negative value is given', () =>
    assertFailsValidationWith(
      css,
      'p { padding-left: -2px; }',
      'invalid-negative-value'
    )
  );

  it('gives a good error when invalid fractional value is given', () =>
    assertFailsValidationWith(
      css,
      'p { z-index: 2.4; }',
      'invalid-fractional-value'
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

    it('fails at the line with the extra value', () =>
      assertFailsValidationAtLine(css, stylesheet, 2)
    );
  });

  context('potentially missing semicolon before first line', () => {
    const stylesheet = `button{border:20px solid b;
    }`;

    it('gives extra tokens error', () =>
      assertFailsValidationWith(css, stylesheet, 'extra-tokens-after-value'));
  });

  context('extra token that is a prefix of the beginning of the line', () => {
    const stylesheet = `
      p {
        border: 20px solid b;
      }
    `;

    it('gives extra tokens error', () =>
      assertFailsValidationWith(css, stylesheet, 'extra-tokens-after-value')
    );
  });

  context('thoroughly unparseable CSS', () => {
    const stylesheet = '<a href=\"http;.facebook.com>';

    it('fails at the first line', () =>
      assertFailsValidationAtLine(css, stylesheet, 1)
    );
  });

  assertPassesAcceptance(css, 'css');
});

