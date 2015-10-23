var i18n = require('i18next-client');
var JSHINT = require('jshint').JSHINT;
var Promise = require('es6-promise').Promise;
var update = require('react/addons').addons.update;
var libraries = require('../config').libraries;

var jshintrc = {
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

var match = {
  '{': '}',
  '[': ']',
  '(': ')',
  '\'': '\'',
  '"': '"',
};

var humanErrors = {
  'E019': function(error) {
    return i18n.t(
      'errors.javascript.unmatched',
      { openingSymbol: error.a, closingSymbol: match[error.a] }
    );
  },

  'E020': function(error) {
    return i18n.t(
      'errors.javascript.closing-match',
      { openingSymbol: error.b, closingSymbol: error.a }
    );
  },

  'E030': function() {
    return i18n.t('errors.javascript.expected-identifier');
  },

  'W003': function(error) {
    return i18n.t(
      'errors.javascript.undefined-variable',
      { variable: error.a }
    );
  },

  'W030': function() {
    return i18n.t('errors.javascript.unexpected-expression');
  },

  'W031': function() {
    return i18n.t('errors.javascript.use-new-object');
  },

  'W032': function() {
    return i18n.t('errors.javascript.unnecessary-semicolon');
  },

  'W033': function() {
    return i18n.t('errors.javascript.missing-semicolon');
  },

  'W058': function(error) {
    return i18n.t(
      'errors.javascript.missing-parentheses',
      { object: error.a }
    );
  },

  'W084': function() {
    return i18n.t('errors.javascript.strict-comparison-operator');
  },

  'W098': function(error) {
    return i18n.t('errors.javascript.unused-variable', { variable: error.a });
  },

  'W112': function() {
    return i18n.t('errors.javascript.unclosed-string');
  },

  'W116': function(error) {
    if (error.a === '===' && error.b === '==') {
      return i18n.t('errors.javascript.strict-operators.equal');
    }
    if (error.a === '!==' && error.b === '!=') {
      return i18n.t('errors.javascript.strict-operators.different');
    }
    return i18n.t(
      'errors.javascript.strict-operators.custom-case',
      { goodOperator: error.a, badOperator: error.b }
    );
  },

  'W117': function(error) {
    return i18n.t('errors.javascript.declare-variable', { variable: error.a });
  },

  'W123': function(error) {
    return i18n.t(
      'errors.javascript.duplicated-declaration',
      { variable: error.a }
    );
  },
};

function convertErrorToAnnotation(error) {
  var code = error.code;
  if (humanErrors.hasOwnProperty(code)) {
    var message = humanErrors[code](error);
    return {
      row: error.line - 1, column: error.character - 1,
      raw: message,
      text: message,
      type: 'error',
    };
  }
}

module.exports = function(source, enabledLibraries) {
  var config = jshintrc;
  enabledLibraries.forEach(function(libraryKey) {
    var library = libraries[libraryKey];

    if (library.validations !== undefined &&
        library.validations.javascript !== undefined) {
      config = update(config, library.validations.javascript);
    }
  });

  JSHINT(source, config);
  var data = JSHINT.data();
  var annotations = [];
  var annotatedLines = [];

  if (data.errors) {
    data.errors.forEach(function(error) {
      if (error === null) {
        return;
      }
      if (annotatedLines.indexOf(error.line) !== -1) {
        return;
      }

      var annotation = convertErrorToAnnotation(error);
      if (annotation !== undefined) {
        annotatedLines.push(annotation.row);
        annotations.push(annotation);
      }
    });
  }

  return Promise.resolve(annotations);
};
