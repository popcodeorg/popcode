import Validator from '../Validator';
import esprima from 'esprima';
import find from 'lodash/find';

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
    const startLocation = token.loc.start;
    const endLocation = token.loc.end;
    return startLocation.line === error.lineNumber &&
      startLocation.column <= error.column - 1 &&
      endLocation.column >= error.column - 1;
  });
}

class EsprimaValidator extends Validator {
  constructor(source) {
    super(source, 'javascript', errorMap);
  }

  _getRawErrors() {
    try {
      esprima.parse(this._source);
    } catch (error) {
      try {
        const tokens = esprima.tokenize(this._source, {loc: true});
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

  _locationForError(error) {
    const row = error.error.lineNumber - 1;
    const column = error.error.column - 1;
    return {row, column};
  }
}

export default (source) => new EsprimaValidator(source).getAnnotations();
