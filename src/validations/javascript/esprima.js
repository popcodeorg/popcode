import find from 'lodash/find';
import inRange from 'lodash/inRange';
import Validator from '../Validator';
import retryingFailedImports from '../../util/retryingFailedImports';

const UNEXPECTED_TOKEN_EXPR = /^Unexpected token (.+)$/;

const errorMap = {
  'Unexpected string': ({token}) => ({
    reason: 'unexpected-string',
    payload: {value: token.value},
    suppresses: [
      'expected-identifier',
      'strict-operators.custom-case',
      'unused-variable',
    ],
  }),

  'Unexpected number': ({token}) => ({
    reason: 'unexpected-number',
    payload: {value: token.value},
    suppresses: [
      'expected-identifier',
      'strict-operators.custom-case',
      'unused-variable',
    ],
  }),

  'Unexpected identifier': ({token}) => ({
    reason: 'unexpected-identifier',
    payload: {name: token.value},
  }),

  'Invalid left-hand side in assignment': ({token}) => {
    let message;
    switch (token.type) {
      case 'String':
        message = 'invalid-left-hand-string';
        break;
      case 'Numeric':
        message = 'invalid-left-hand-number';
        break;
      case 'Boolean':
        message = 'invalid-left-hand-boolean';
        break;
      default:
        message = 'invalid-left-hand-value';
        break;
    }

    return ({
      reason: `${message}`,
      payload: {value: token.value},
      suppresses: [
        'missing-semicolon',
        'expected-identifier',
        'unexpected-expression',
        'closing-match',
        'strict-operators.custom-case',
      ],
    });
  },

  'Unexpected end of input': () => ({reason: 'end-of-input'}),

  'Unexpected token ILLEGAL': () => ({reason: 'tokenize-error'}),
};

function findTokenForError(error, tokens) {
  return find(tokens, (token) => {
    const [startLocation, endLocation] = token.range;
    return inRange(error.index, startLocation, endLocation + 1);
  });
}

class EsprimaValidator extends Validator {
  constructor(source) {
    super(source, 'javascript', errorMap);
  }

  async _getRawErrors() {
    const esprima = await retryingFailedImports(() => import(
      /* webpackChunkName: 'linters' */
      'esprima',
    ));
    try {
      esprima.parse(this._source);
    } catch (error) {
      try {
        const tokens = esprima.tokenize(
          this._source,
          {range: true, comment: true},
        );
        const token = findTokenForError(error, tokens);
        return [{error, token}];
      } catch (tokenizeError) {
        return [{error: tokenizeError}];
      }
    }
    return [];
  }

  _keyForError(error) {
    return error.error.description;
  }

  _mapError(error) {
    const mappedError = super._mapError(error);
    if (mappedError) {
      return mappedError;
    }

    const match = UNEXPECTED_TOKEN_EXPR.exec(this._keyForError(error));
    if (match) {
      return {
        reason: 'unexpected-token',
        payload: {token: match[1]},
        suppresses: ['unexpected-expression'],
      };
    }

    return {reason: 'tokenize-error'};
  }

  _locationForError(error) {
    const row = error.error.lineNumber - 1;
    const column = error.error.column - 1;
    return {row, column};
  }
}

export default source => new EsprimaValidator(source).getAnnotations();
