/* eslint-env mocha */

import '../../helper';
import {
  assertPassesValidation,
  assertFailsValidationWith,
} from '../../assertions/validations';
import assertPassesAcceptance from './assertPassesAcceptance';

import html from '../../../src/validations/html';

function htmlWithBody(body) {
  return `<!doctype html>
<html>
<body>
  ${body}
</body>
</html>
`;
}

describe('html', () => {
  it('allows valid HTML', () =>
    assertPassesValidation(html, htmlWithBody(''))
  );

  it('fails with banned attribute', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<p align="center"></p>'),
      'banned-attributes.align'
    )
  );

  it('allows void tags without explicit close', () =>
    assertPassesValidation(
      html,
      htmlWithBody('<img src="test.jpg">')
    )
  );

  it('gives error message for missing structure and unclosed p tag', () =>
    assertFailsValidationWith(
      html,
      '<p>T',
      'unclosed-tag',
      'doctype'
    )
  );

  it('generates unclosed-tag error for missing closing tag', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<div>'),
      'mismatched-close-tag'
    )
  );

  it('generates unclosed-tag error for missing closing p tag', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<p>'),
      'mismatched-close-tag'
    )
  );

  it('generates unterminated-close-tag error for unfinished closing tag', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<div></div'),
      'unterminated-close-tag'
    )
  );

  it('generates mismatched-close-tag error for mismatched closing tag', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<div></div></span>'),
      'mismatched-close-tag'
    )
  );

  it('generates meaningful error for space inside HTML angle bracket', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('< p>Content</p>'),
      'space-before-tag-name'
    )
  );

  it('allows lowercase attributes', () =>
    assertPassesValidation(
      html,
      htmlWithBody('<div id="first">Content</div>')
    )
  );

  it('allows lowercase data attributes', () =>
    assertPassesValidation(
      html,
      htmlWithBody('<div data-id="1">Content</div>')
    )
  );

  it('generates error for uppercase attributes', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<div ID="first">Content</div>'),
      'lower-case-attribute-name'
    )
  );

  it('generates error for uppercase data attributes', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<div data-ID="first">Content</div>'),
      'lower-case-attribute-name'
    )
  );

  it('generates error when li is not inside ul', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<li>Orphaned List Item</li>'),
      'invalid-tag-parent'
    )
  );

  it('generates error when li is inside a non-body tag', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<div><li>List within span</li></div>'),
      'invalid-tag-parent'
    )
  );

  it('allows li within ul', () =>
    assertPassesValidation(
      html,
      htmlWithBody('<ul><li>List item</li></ul>')
    )
  );

  it('allows li within ol', () =>
    assertPassesValidation(
      html,
      htmlWithBody('<ol><li>List item</li></ol>')
    )
  );

  it('generates error when div is inside span', () =>
    assertFailsValidationWith(
      html,
      htmlWithBody('<span><div>Block inside inline</div></span>'),
      'invalid-tag-location'
    )
  );

  it('generates meaningful error for extra tag at end of doc', () =>
    assertFailsValidationWith(
      html,
      `<!DOCTYPE html>
       <html>
       <head><title>Page Title</title></head>
       <body></body>
       </html>
       </div>`,
      'unexpected-close-tag'
    )
  );

  it('produces an error for a malformed DOCTYPE that doesn’t parse', () =>
    assertFailsValidationWith(html, '<!DOCT\n', 'doctype')
  );

  assertPassesAcceptance(html, 'html');
});
