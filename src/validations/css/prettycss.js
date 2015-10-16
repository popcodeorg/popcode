var i18n = require('i18next-client');
var prettyCSS = require('PrettyCSS');
var Promise = require('es6-promise').Promise;

var humanErrors = {
  'block-expected': function(error) {
    return i18n.t(
      'errors.prettycss.block-expected',
      { error: error.token.content }
    );
  },

  'extra-tokens-after-value': function() {
    return i18n.t('errors.prettycss.extra-tokens-after-value');
  },

  'illegal-token-after-combinator': function() {
    return i18n.t('errors.prettycss.illegal-token-after-combinator');
  },

  'invalid-token': function() {
    return i18n.t('errors.prettycss.invalid-token');
  },

  'invalid-value': function(error) {
    return i18n.t(
      'errors.prettycss.invalid-value',
      { error: error.token.content }
    );
  },

  'require-value': function(error) {
    return i18n.t(
      'errors.prettycss.require-value',
      { error: error.token.content }
    );
  },

  'selector-expected': function() {
    return i18n.t('errors.prettycss.selector-expected');
  },

  'unknown-property': function(error) {
    return i18n.t(
      'errors.prettycss.unknown-property',
      { error: error.token.content }
    );
  },
};

function convertErrorToAnnotation(error) {
  var normalized_code = error.code.split(':')[0];
  if (error.token !== null && humanErrors.hasOwnProperty(normalized_code)) {
    var message = humanErrors[normalized_code](error);
    return {
      row: error.token.line - 1, column: error.token.charNum - 1,
      raw: message,
      text: message,
      type: 'error',
    };
  }
}

module.exports = function(source) {
  var result = prettyCSS.parse(source);
  var annotations = [];
  result.errors.concat(result.warnings).forEach(function(error) {
    var annotation = convertErrorToAnnotation(error);
    if (annotation !== undefined) {
      annotations.push(annotation);
    }
  });
  return Promise.resolve(annotations);
};
