import castArray from 'lodash-es/castArray';
import concat from 'lodash-es/concat';
import clone from 'lodash-es/clone';
import compact from 'lodash-es/compact';
import defaults from 'lodash-es/defaults';
import find from 'lodash-es/find';
import includes from 'lodash-es/includes';
import {JSHINT as jshint} from 'jshint';

import libraries from '../../config/libraries';
import Validator from '../Validator';

const jshintrc = {
  browser: true,
  curly: true,
  devel: true,
  eqeqeq: true,
  latedef: 'nofunc',
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
  E019: error => ({
    reason: 'unmatched',
    payload: {openingSymbol: error.a, closingSymbol: match[error.a]},
    suppresses: ['end-of-input'],
  }),

  E020: error => ({
    reason: 'closing-match',
    payload: {openingSymbol: error.b, closingSymbol: error.a},
  }),

  E024: error => ({
    reason: 'unexpected',
    payload: {character: error.evidence},
    suppresses: ['tokenize-error'],
  }),

  E030: error => ({
    reason: 'expected-identifier',
    payload: {token: error.a},
  }),

  W003: error => ({
    reason: 'undefined-variable',
    payload: {variable: error.a},
  }),

  W030: error => ({
    reason: 'unexpected-expression',
    payload: {expression: error.evidence},
  }),

  W031: () => ({reason: 'use-new-object'}),

  W032: () => ({reason: 'unnecessary-semicolon'}),

  W033: () => ({reason: 'missing-semicolon'}),

  W058: error => ({
    reason: 'missing-parentheses',
    payload: {object: error.a},
  }),

  W067: () => ({reason: 'bad-invocation'}),

  W084: () => ({reason: 'strict-comparison-operator'}),

  W098: error => ({
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

    if (error.b === '') {
      return {
        reason: 'missing-token',
        payload: {token: error.a},
        suppresses: ['end-of-input'],
      };
    }

    return {
      reason: 'strict-operators.custom-case',
      payload: {goodOperator: error.a, badOperator: error.b},
      suppresses: ['expected-identifier'],
    };
  },

  W117: (error) => {
    const identifier = error.a;

    const providingLibrary = find(
      libraries,
      library =>
        library.predefined && includes(library.predefined, identifier),
    );

    if (providingLibrary) {
      return {
        reason: 'missing-library',
        payload: {variable: identifier, library: providingLibrary.name},
      };
    }

    return {
      reason: 'declare-variable',
      payload: {variable: identifier},
    };
  },

  W123: error => ({
    reason: 'duplicated-declaration',
    payload: {variable: error.a},
  }),
};

class JsHintValidator extends Validator {
  constructor(source, analyzer) {
    super(source, 'javascript', errorMap);
    this._jshintOptions = this._getConfig(
      analyzer.containsExternalScript,
      analyzer.enabledLibraries,
    );
  }

  _getConfig(containsExternalScript, enabledLibraries) {
    const options = defaults(clone(jshintrc), {predef: []});

    if (containsExternalScript) {
      options.undef = false;
    }

    enabledLibraries.forEach((libraryKey) => {
      if (!(libraryKey in libraries)) {
        return;
      }

      const library = libraries[libraryKey];

      if (library.predefined) {
        options.predef =
          concat(options.predef, library.predefined);
      }
    });

    return options;
  }

  async getRawErrors() {
    try {
      jshint(this.source, this._jshintOptions);
    } catch (e) {
      return [];
    }

    const data = jshint.data();
    return compact(castArray(data.errors));
  }

  keyForError(error) {
    return error.code;
  }

  locationForError(error) {
    const row = error.line - 1;
    const column = error.character - 1;
    return {row, column};
  }
}

export default (source, analyzer) =>
  new JsHintValidator(source, analyzer).getAnnotations();
