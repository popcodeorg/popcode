var htmllint = require('htmllint');

var humanErrors = {
  "E001": function(error) {
    switch(error.data.attribute.toLowerCase()) {
      case 'align':
        return "Don't use the \"align\" attribute. Instead, use the CSS text-align property";
      case 'background':
        return "Don't use the \"background\" attribute. Instead, use the CSS background property";
      case 'bgcolor':
        return "Don't use the \"bgcolor\" attribute. Instead, use the CSS background-color property";
      case 'border':
      case 'frameborder':
        return "Don't use the \"" + error.data.attribute + "\" attribute. Instead, use the CSS border property";
      case 'marginwidth':
        return "Don't use the \"marginwidth\" attribute. Instead, use the CSS margin-left and margin-right properties";
      case 'marginheight':
        return "Don't use the \"marginheight\" attribute. Instead, use the CSS margin-top and margin-bottom properties";
      case 'scrolling':
        return "Don't use the \"scrolling\" attribute. Instead, use the CSS overflow property";
      case 'width':
        return "Don't use the \"width\" attribute. Instead, use the CSS width property";
    }
  },

  "E002": function() {
    return "Use lower case for attribute names";
  },

  "E005": function(error) {
    return "You need to put the value of the " + error.data.attribute + " attribute in quotation marks\nTry: " + error.data.attribute + "=\"myvalue\"";
  },

  "E006": function(error) {
    return "Every attribute needs a value.\nTry: myattribute=\"myvalue\"";
  },

  "E007": function() {
    return "The first line of your HTML should always be:\n<!DOCTYPE html>";
  },

  "E008": function() {
    return "The first line of your HTML should always be:\n<!DOCTYPE html>";
  },

  "E012": function(error) {
    return "You can't use the id \"" + error.data.id + "\" more than once in your HTML";
  },

  "E014": function() {
    return "<img> tags need a src attribute, with the URL of the image you want to display.\nTry: <img src=\"http://coolimages.com/image.jpg\">";
  },

  "E016": function(error) {
    switch (error.data.tag.toLowerCase()) {
      case 'i':
        return "You shouldn't use the <i> tag. Use the <em> tag instead.";
      case 'b':
        return "You shouldn't use the <b> tag. Use the <strong> tag instead.";
    }
  },

  "E017": function() {
    return "Use lower case for tag names";
  },

  "E027": function() {
    return "Put a <title> tag inside your <head> tag";
  },

  "E028": function() {
    return "You have more than one <title> tag in your document; you should only have one";
  },

  "E030": function() {
    return "You have an opening tag somewhere in the HTML that doesn't have a closing tag to match it.";
  },

  "E036": function() {
    return "Lines should be indented with four spaces.\nUse the 'tab' key to increase indentation and the 'delete' key to decrease indentation.";
  }
};

var htmlLintOptions = {
  'attr-bans': [
    'align',
    'background',
    'bgcolor',
    'border',
    'frameborder',
    'marginwidth',
    'marginheight',
    'scrolling',
    'width'
  ],
  'attr-name-style': 'lowercase',
  'attr-no-dup': true,
  'attr-quote-style': 'quoted',
  'doctype-first': true,
  'doctype-html5': true,
  'head-req-title': true,
  'id-class-style': false,
  'id-no-dup': true,
  'img-req-alt': false,
  'img-req-src': true,
  'indent-style': 'spaces',
  'indent-width': 4,
  'line-end-style': false,
  'tag-bans': [
    'b',
    'i'
  ],
  'tag-name-match': true,
  'tag-name-lowercase': true,
  'title-max-length': 0,
  'title-no-dup': true
}

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.code)) {
    var message = humanErrors[error.code](error);
    return {
      row: error.line - 1, column: error.column - 1,
      raw: message,
      text: message,
      type: "error"
    };
  } else {
    console.warn("Couldn't find a human description for", error, htmllint.messages.renderIssue(error));
  }
};

module.exports = function(source) {
  return htmllint(source, htmlLintOptions).then(function(errors) {
    var annotations = [];
    errors.forEach(function(error) {
      var annotation = convertErrorToAnnotation(error);
      if (annotation !== undefined) {
        annotations.push(annotation);
      }
    });
    return annotations;
  }, function(error) {
    console.error('htmllint error', error)
  });
};
