/* eslint-env mocha */

import '../../helper';
import {
  assertPassesValidation,
  assertFailsValidationWith,
} from '../../assertions/validations';

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

function assertPassesHtmlValidation(source) {
  return assertPassesValidation(html, source);
}

function assertFailsHtmlValidationWith(source, ...errors) {
  return assertFailsValidationWith(html, source, ...errors);
}

describe('html', () => {
  it('allows valid HTML', () =>
    assertPassesHtmlValidation(htmlWithBody(''))
  );

  it('fails with banned attribute', () =>
    assertFailsHtmlValidationWith(
      htmlWithBody('<p align="center"></p>'),
      'banned-attributes.align'
    )
  );
});
