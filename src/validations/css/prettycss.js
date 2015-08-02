var prettyCSS = require('PrettyCSS');
var Promise = require('es6-promise').Promise;

var humanErrors = {
  "block-expected": function(error) {
    return "Start a block using { after your selector.\nTry: " + error.token.content + " {";
  },

  "extra-tokens-after-value": function() {
    return "Looks like you're missing a semicolon on the line before this one.";
  },

  "illegal-token-after-combinator": function() {
    return "After a + or > in a selector, you need to specify the name of another element, class, or ID";
  },

  "invalid-token": function() {
    return "This line doesn't look like valid CSS.";
  },

  "invalid-value": function(error) {
    return error.token.content + " isn't a meaningful value for this property. Double-check what values you can use here.";
  },

  "require-value": function(error) {
    return "Put a value for " + error.token.content + " after the colon.";
  },

  "selector-expected": function() {
    return "Use a comma to separate multiple tag names, classes, or IDs.";
  },

  "unknown-property": function(error) {
    return error.token.content + " isn't a property that CSS understands. Double-check the name of the property that you want to use.";
  }
};

function convertErrorToAnnotation(error) {
  var normalized_code = error.code.split(':')[0];
  if (error.token !== null && humanErrors.hasOwnProperty(normalized_code)) {
    var message = humanErrors[normalized_code](error);
    return {
      row: error.token.line - 1, column: error.charNum - 1,
      raw: message,
      text: message,
      type: "error"
    };
  } else {
    console.warn("Couldn't find a human description for", error);
  }
};

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
