var JSHINT = require('jshint').JSHINT;

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
    return "There is a " + error.a + " on this line that needs a closing " + match[error.a];
  },

  "E020": function(error) {
    return "There is a " + error.b + " on this line that needs a closing " + error.a;
  },

  "E030": function() {
    return "There's something missing from this line. Did you forget something?";
  },

  "W003": function(error) {
    return "You can't use the variable "  + error.a + " before declaring it.";
  },

  "W030": function() {
    return "It looks like there's something on this line that doesn't belong there";
  },

  "W031": function() {
    return "If you are making a new object, be sure to use it or store it in a variable";
  },

  "W032": function() {
    return "You don't need a semicolon ; on this line";
  },

  "W033": function() {
    return "You need a semicolon ; at the end of this line";
  },

  "W058": function(error) {
    return "There should be parentheses here.\nTry: new " + error.a + "()";
  },

  "W084": function() {
    return "Use === to check if two things are equal";
  },

  "W098": function(error) {
    return "You don't use the variable " + error.a + " anywhere";
  },

  "W112": function() {
    return "The string on this line needs to end with another quotation mark";
  },

  "W116": function(error) {
    if (error.a === "===" && error.b === "==") {
      return "You should use === instead of ==";
    } else if (error.a === "!==" && error.b === "!=") {
      return "You should use !== instead of !=";
    } else {
      return "There should be a " + error.a + " where you wrote " + error.b;
    }
  },

  "W117": function(error) {
    return "You haven't declared " + error.a + ".\nTry: var " + error.a + ";";
  },

  "W123": function(error) {
    return "You already declared " + error.a + " somewhere else.";
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

  return annotations;
};
