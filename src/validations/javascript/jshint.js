import Validator from '../Validator';
import assign from 'lodash/assign';
import castArray from 'lodash/castArray';
import clone from 'lodash/clone';
import compact from 'lodash/compact';
import get from 'lodash/get';
import {JSHINT} from 'jshint';
import libraries from '../../config/libraries';

const jshintrc = {
  browser: true,
  curly: true,
  devel: true,
  eqeqeq: true,
  latedef: true,
  nonew: true,
  predef: [],
  shadow: 'outer',
  undef: true,
};

const match = {
  '{': '}',
  '[': ']',
  '(': ')',
  '\'': '\'',
  '"': '"',
};

const errorMap = {
  E019: (error) => ({
    reason: 'unmatched',
    payload: {openingSymbol: error.a, closingSymbol: match[error.a]},
  }),

  E020: (error) => ({
    reason: 'closing-match',
    payload: {openingSymbol: error.b, closingSymbol: error.a},
  }),

  E024: (error) => ({
    reason: 'unexpected',
    payload: {character: error.evidence},
    suppresses: ['tokenize-error'],
  }),

  E030: (error) => ({
    reason: 'expected-identifier',
    payload: {token: error.a},
  }),

  W003: (error) => ({
    reason: 'undefined-variable',
    payload: {variable: error.a},
  }),

  W030: (error) => ({
    reason: 'unexpected-expression',
    payload: {expression: error.evidence},
  }),

  W031: () => ({reason: 'use-new-object'}),

  W032: () => ({reason: 'unnecessary-semicolon'}),

  W033: () => ({reason: 'missing-semicolon'}),

  W058: (error) => ({
    reason: 'missing-parentheses',
    payload: {object: error.a},
  }),

  W067: () => ({reason: 'bad-invocation'}),

  W084: () => ({reason: 'strict-comparison-operator'}),

  W098: (error) => ({
    reason: 'unused-variable',
    payload: {variable: error.a},
  }),

  W112: () => ({
    reason: 'unclosed-string',
    suppresses: ['expected-identifier', 'tokenize-error', 'missing-semicolon'],
  }),

  W116: (error) => {
    if (error.a === '===' && error.b === '==') {
      return {reason: 'strict-operators.equal'};
    }
    if (error.a === '!==' && error.b === '!=') {
      return {reason: 'strict-operators.different'};
    }
    return {
      reason: 'strict-operators.custom-case',
      payload: {goodOperator: error.a, badOperator: error.b},
      suppresses: ['expected-identifier'],
    };
  },

  W117: (error) => ({
    reason: 'declare-variable',
    payload: {variable: error.a},
  }),

  W123: (error) => ({
    reason: 'duplicated-declaration',
    payload: {variable: error.a},
  }),
};

class JsHintValidator extends Validator {
  constructor(source, enabledLibraries) {
    super(source, 'javascript', errorMap);

    this._jshintOptions = clone(jshintrc);
    enabledLibraries.forEach((libraryKey) => {
      const library = libraries[libraryKey];

      if (get(library, 'validations.javascript') !== undefined) {
        assign(this._jshintOptions, library.validations.javascript);
      }
    });
  }

  _getRawErrors() {
    JSHINT(this._source, this._jshintOptions); // eslint-disable-line new-cap
    const data = JSHINT.data();
    return compact(castArray(data.errors));
  }

  _keyForError(error) {
    return error.code;
  }

  _locationForError(error) {
    const row = error.line - 1;
    const column = error.character - 1;
    return {row, column};
  }
}

export default (source, enabledLibraries) =>
  new JsHintValidator(source, enabledLibraries).getAnnotations();
