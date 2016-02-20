import i18n from 'i18next-client';
import prettyCSS from 'PrettyCSS';
import {Promise} from 'es6-promise';

const RADIAL_GRADIENT_EXPR =
  /^(?:(?:-(?:ms|moz|o|webkit)-)?radial-gradient|-webkit-gradient)/;
function isIncorrectlyRejectedRadialGradientValue(value) {
  return RADIAL_GRADIENT_EXPR.test(value);
}

const humanErrors = {
  'block-expected': (error) => i18n.t(
    'errors.prettycss.block-expected',
    {error: error.token.content}
  ),

  'extra-tokens-after-value': () => i18n.t(
    'errors.prettycss.extra-tokens-after-value'
  ),

  'illegal-token-after-combinator': () => i18n.t(
    'errors.prettycss.illegal-token-after-combinator'
  ),

  'invalid-token': () => i18n.t('errors.prettycss.invalid-token'),

  'invalid-value': (error) => {
    if (isIncorrectlyRejectedRadialGradientValue(error.token.content)) {
      return null;
    }

    return i18n.t(
      'errors.prettycss.invalid-value',
      {error: error.token.content}
    );
  },

  'require-value': (error) => i18n.t(
    'errors.prettycss.require-value',
    {error: error.token.content}
  ),

  'selector-expected': () => i18n.t('errors.prettycss.selector-expected'),

  'unknown-property': (error) => i18n.t(
    'errors.prettycss.unknown-property',
    {error: error.token.content}
  ),
};

function convertErrorToAnnotation(error) {
  const normalizedCode = error.code.split(':')[0];
  if (error.token !== null && humanErrors.hasOwnProperty(normalizedCode)) {
    const message = humanErrors[normalizedCode](error);
    if (message !== null) {
      return {
        row: error.token.line - 1, column: error.token.charNum - 1,
        raw: message,
        text: message,
        type: 'error',
      };
    }
  }

  return null;
}

export default (source) => {
  const result = prettyCSS.parse(source);
  const annotations = [];
  result.errors.concat(result.warnings).forEach((error) => {
    const annotation = convertErrorToAnnotation(error);
    if (annotation !== null) {
      annotations.push(annotation);
    }
  });
  return Promise.resolve(annotations);
};
