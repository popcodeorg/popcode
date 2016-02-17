import i18n from 'i18next-client';
import {JSHINT} from 'jshint';
import {Promise} from 'es6-promise';
import update from 'react-addons-update';
import {libraries} from '../config';

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
  unused: true,
};

const match = {
  '{': '}',
  '[': ']',
  '(': ')',
  '\'': '\'',
  '"': '"',
};

const humanErrors = {
  E019: (error) => i18n.t(
    'errors.javascript.unmatched',
    {openingSymbol: error.a, closingSymbol: match[error.a]}
  ),

  E020: (error) => i18n.t(
    'errors.javascript.closing-match',
    {openingSymbol: error.b, closingSymbol: error.a}
  ),

  E030: () => i18n.t('errors.javascript.expected-identifier'),

  W003: (error) => i18n.t(
    'errors.javascript.undefined-variable',
    {variable: error.a}
  ),

  W030: () => i18n.t('errors.javascript.unexpected-expression'),

  W031: () => i18n.t('errors.javascript.use-new-object'),

  W032: () => i18n.t('errors.javascript.unnecessary-semicolon'),

  W033: () => i18n.t('errors.javascript.missing-semicolon'),

  W058: (error) => i18n.t(
    'errors.javascript.missing-parentheses',
    {object: error.a}
  ),

  W084: () => i18n.t('errors.javascript.strict-comparison-operator'),

  W098: (error) => i18n.t(
    'errors.javascript.unused-variable',
    {variable: error.a}
  ),

  W112: () => i18n.t('errors.javascript.unclosed-string'),

  W116: (error) => {
    if (error.a === '===' && error.b === '==') {
      return i18n.t('errors.javascript.strict-operators.equal');
    }
    if (error.a === '!==' && error.b === '!=') {
      return i18n.t('errors.javascript.strict-operators.different');
    }
    return i18n.t(
      'errors.javascript.strict-operators.custom-case',
      {goodOperator: error.a, badOperator: error.b}
    );
  },

  W117: (error) => i18n.t(
    'errors.javascript.declare-variable',
    {variable: error.a}
  ),

  W123: (error) => i18n.t(
    'errors.javascript.duplicated-declaration',
    {variable: error.a}
  ),
};

function convertErrorToAnnotation(error) {
  const code = error.code;
  if (humanErrors.hasOwnProperty(code)) {
    const message = humanErrors[code](error);
    return {
      row: error.line - 1, column: error.character - 1,
      raw: message,
      text: message,
      type: 'error',
    };
  }
  return undefined;
}

export default (source, enabledLibraries) => {
  let config = jshintrc;
  enabledLibraries.forEach((libraryKey) => {
    const library = libraries[libraryKey];

    if (library.validations !== undefined &&
        library.validations.javascript !== undefined) {
      config = update(config, library.validations.javascript);
    }
  });

  JSHINT(source, config); // eslint-disable-line new-cap
  const data = JSHINT.data();
  const annotations = [];
  const annotatedLines = [];

  if (data.errors) {
    data.errors.forEach((error) => {
      if (error === null) {
        return;
      }
      if (annotatedLines.indexOf(error.line) !== -1) {
        return;
      }

      const annotation = convertErrorToAnnotation(error);
      if (annotation !== undefined) {
        annotatedLines.push(annotation.row);
        annotations.push(annotation);
      }
    });
  }

  return Promise.resolve(annotations);
};
