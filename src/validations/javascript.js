var i18n = require('i18next-client');
var JSHINT = require('jshint').JSHINT;
var Promise = require('es6-promise').Promise;

var jshintrc = {
  browser: true,
  curly: true,
  devel: true,
  eqeqeq: true,
  latedef: true,
  nonew: true,
  shadow: "outer",
  undef: true,
  unused: true
};

var match = {
  "{": "}",
  "[": "]",
  "(": ")",
  "'": "'",
  '"': '"'
};

var humanErrors = {
  "E019": function(error) {
    return i18n.t("javascript.unmatched", { opening_symbol: error.a, closing_symbol: match[error.a] });
  },

  "E020": function(error) {
    return i18n.t("javascript.closing-match", { opening_symbol: error.b, closing_symbol: error.a });
  },

  "E030": function() {
    return i18n.t("javascript.expected-identifier");
  },

  "W003": function(error) {
    return i18n.t("javascript.undefined-variable", { variable: error.a });
  },

  "W030": function() {
    return i18n.t("javascript.unexpected-expression");
  },

  "W031": function() {
    return i18n.t("javascript.use-new-object");
  },

  "W032": function() {
    return i18n.t("javascript.unnecessary-semicolon");
  },

  "W033": function() {
    return i18n.t("javascript.missing-semicolon");
  },

  "W058": function(error) {
    return i18n.t("javascript.missing-parentheses", { object: error.a } );
  },

  "W084": function() {
    return i18n.t("javascript.strict-comparison-operator");
  },

  "W098": function(error) {
    return i18n.t("javascript.unused-variable", { variable: error.a });
  },

  "W112": function() {
    return i18n.t("javascript.unclosed-string");
  },

  "W116": function(error) {
    if (error.a === "===" && error.b === "==") {
      return i18n.t("javascript.strict-operators.equal");
    } else if (error.a === "!==" && error.b === "!=") {
      return i18n.t("javascript.strict-operators.different");
    } else {
      return i18n.t("javascript.strict-operators.custom-case", { good_operator: error.a, bad_operator: error.b });
    }
  },

  "W117": function(error) {
    i18n.t("javascript.declare-variable", { variable: error.a });
  },

  "W123": function(error) {
    i18n.t("javascript.duplicated-declaration", { variable: error.a });
  }
};

function convertErrorToAnnotation(error) {
  var code = error.code;
  if (humanErrors.hasOwnProperty(code)) {
    var message = humanErrors[code](error);
    return {
      row: error.line - 1, column: error.character - 1,
      raw: message,
      text: message,
      type: "error"
    };
  }
}

module.exports = function(source) {
  JSHINT(source, jshintrc);
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
