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
    return i18n.t("javascript.E019", { error_a: error.a, error_a_match: match[error.a] });
  },

  "E020": function(error) {
    return i18n.t("javascript.E019", { error_a: error.a, error_b: error.b });
  },

  "E030": function() {
    return i18n.t("javascript.E030");
  },

  "W003": function(error) {
    return i18n.t("javascript.E030", { error_a: error.a });
  },

  "W030": function() {
    return i18n.t("javascript.W030");
  },

  "W031": function() {
    return i18n.t("javascript.W031");
  },

  "W032": function() {
    return i18n.t("javascript.W032");
  },

  "W033": function() {
    return i18n.t("javascript.W033");
  },

  "W058": function(error) {
    return i18n.t("javascript.W058", { error_a: error.a } );
  },

  "W084": function() {
    return i18n.t("javascript.W084");
  },

  "W098": function(error) {
    return i18n.t("javascript.W098", { error_a: error.a });
  },

  "W112": function() {
    return i18n.t("javascript.W112");
  },

  "W116": function(error) {
    if (error.a === "===" && error.b === "==") {
      return i18n.t("javascript.W116.case-1");
    } else if (error.a === "!==" && error.b === "!=") {
      return i18n.t("javascript.W116.case-2");
    } else {
      return i18n.t("javascript.W116.case-3", { error_a: error.a, error_b: error.b });
    }
  },

  "W117": function(error) {
    i18n.t("javascript.W117", { error_a: error.a });
  },

  "W123": function(error) {
    i18n.t("javascript.W123", { error_a: error.a });
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
