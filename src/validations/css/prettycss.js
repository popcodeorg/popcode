import trim from 'lodash/trim';
import endsWith from 'lodash/endsWith';
import Validator from '../Validator';
import retryingFailedImports from '../../util/retryingFailedImports';

const RADIAL_GRADIENT_EXPR =
  /^(?:(?:-(?:ms|moz|o|webkit)-)?radial-gradient|-webkit-gradient)/;

const FILTER_VALUE_EXPR =
  new RegExp([
    '^blur\\(',
    '^brightness\\(',
    '^contrast\\(',
    '^drop-shadow\\(',
    '^grayscale\\(',
    '^hue-rotate\\(',
    '^invert\\(',
    '^opacity\\(',
    '^saturate\\(',
    '^sepia\\(',
    '^inherit$',
  ].join('|'));

function isIncorrectlyRejectedValue(value) {
  return isIncorrectlyRejectedRadialGradientValue(value) ||
    isIncorrectlyRejectedFilterValue(value);
}

function isIncorrectlyRejectedRadialGradientValue(value) {
  return RADIAL_GRADIENT_EXPR.test(value);
}
function isIncorrectlyRejectedFilterValue(value) {
  return FILTER_VALUE_EXPR.test(value);
}

const errorMap = {
  'block-expected': (error) => {
    const tokenType = error.token.type;
    const token = error.token.content;

    if (tokenType === 'IDENT' || tokenType === 'S') {
      return {
        reason: 'block-expected',
        payload: {error: token},
        suppresses: ['missing-opening-curly'],
      };
    }

    return {
      reason: 'invalid-token-in-selector',
      payload: {token},
    };
  },

  'extra-tokens-after-value': (error, source) => {
    const errorToken = error.token;
    const lineNumber = errorToken.line;

    if (lineNumber > 1) {
      const lines = source.split('\n');
      const previousLine = lines[lineNumber - 2];
      const thisLine = lines[lineNumber - 1];

      if (
        errorToken.charNum - 1 === /\S/.exec(thisLine).index &&
        !endsWith(trim(previousLine), ';')
      ) {
        return {
          reason: 'missing-semicolon',
          row: lineNumber - 2,
          column: previousLine.length - 1,
        };
      }
    }

    return ({
      reason: 'extra-tokens-after-value',
      payload: {token: errorToken.content},
    });
  },

  'illegal-token-after-combinator': () => ({
    reason: 'illegal-token-after-combinator',
    suppresses: ['block-expected'],
  }),

  'invalid-token': () => ({
    reason: 'invalid-token',
    suppresses: [
      'illegal-token-after-combinator',
      'invalid-token-in-selector',
      'missing-opening-curly',
    ],
  }),

  'invalid-value': (error) => {
    if (isIncorrectlyRejectedValue(error.token.content)) {
      return null;
    }

    return {
      reason: 'invalid-value',
      payload: {error: error.token.content},
    };
  },

  'require-value': error => ({
    reason: 'require-value',
    payload: {error: error.token.content},
  }),

  'require-positive-value': error => ({
    reason: 'invalid-negative-value',
    payload: {error: error.token.content},
  }),

  'require-integer': error => ({
    reason: 'invalid-fractional-value',
    payload: {error: error.token.content},
  }),

  'selector-expected': () => ({reason: 'selector-expected'}),

  'unknown-property': error => ({
    reason: 'unknown-property',
    payload: {error: error.token.content},
  }),
};

class PrettyCssValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  async _getRawErrors() {
    const prettyCSS = await retryingFailedImports(() => import(
      /* webpackChunkName: 'linters' */
      'PrettyCSS',
    ));
    try {
      const result = prettyCSS.parse(this._source);
      return result.getProblems();
    } catch (_e) {
      return [];
    }
  }

  _keyForError(error) {
    return error.code.split(':')[0];
  }

  _locationForError(error) {
    if (!error.token) {
      return {row: 0, column: 0};
    }
    return {row: error.token.line - 1, column: error.token.charNum - 1};
  }
}

export default source => new PrettyCssValidator(source).getAnnotations();
