var css = require('css');

var humanErrors = {
  "missing '}'": function() {
    return "You have a starting { but no ending } to go with it.";
  },

  "property missing ':'": function() {
    return "Put a colon (:) between the property and the value.\nTry: color: red";
  },

  "selector missing": function() {
    return "Start every block of CSS with a selector, such as an element name or class name.\nTry: p {\n  color: red;\n}";
  }
};

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.reason)) {
    var message = humanErrors[error.reason](error);
    return {
      row: error.line - 1, column: error.column - 1,
      raw: message,
      text: message,
      type: "error"
    };
  } else {
    console.warn("Couldn't find a human description for", error);
  }
};

module.exports = function(source) {
  var result = css.parse(source, {silent: true}).stylesheet;
  var annotations = [];
  result.parsingErrors.forEach(function(error) {
    var annotation = convertErrorToAnnotation(error);
    if (annotation !== undefined) {
      annotations.push(annotation);
    }
  });
  return annotations;
};
