import prettyCSS from 'PrettyCSS';
import Validator from '../Validator';

const RADIAL_GRADIENT_EXPR =
  /^(?:(?:-(?:ms|moz|o|webkit)-)?radial-gradient|-webkit-gradient)/;
function isIncorrectlyRejectedRadialGradientValue(value) {
  return RADIAL_GRADIENT_EXPR.test(value);
}

const errorMap = {
  'block-expected': (error) => ({
    reason: 'block-expected',
    payload: {error: error.token.content},
  }),

  'extra-tokens-after-value': () => ({
    reason: 'extra-tokens-after-value',
  }),

  'illegal-token-after-combinator': () => ({
    reason: 'illegal-token-after-combinator',
    suppresses: ['block-expected'],
  }),

  'invalid-token': () => ({reason: 'invalid-token'}),

  'invalid-value': (error) => {
    if (isIncorrectlyRejectedRadialGradientValue(error.token.content)) {
      return null;
    }

    return {
      reason: 'invalid-value',
      payload: {error: error.token.content},
    };
  },

  'require-value': (error) => ({
    reason: 'require-value',
    payload: {error: error.token.content},
  }),

  'selector-expected': () => ({reason: 'selector-expected'}),

  'unknown-property': (error) => ({
    reason: 'unknown-property',
    payload: {error: error.token.content},
  }),
};

class PrettyCssValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  _getRawErrors() {
    try {
      const result = prettyCSS.parse(this._source);
      return result.errors.concat(result.warnings);
    } catch (_e) {
      return [];
    }
  }

  _keyForError(error) {
    return error.code.split(':')[0];
  }

  _locationForError(error) {
    return {row: error.token.line - 1, column: error.token.charNum - 1};
  }
}

export default (source) => new PrettyCssValidator(source).getAnnotations();
