var i18n = require('i18next-client');
var htmllint = require('htmllint');
var lodash = require('lodash');

var humanErrors = {
  E001: function(error) {
    switch (error.data.attribute.toLowerCase()) {
      case 'align':
        return generateAnnotation('banned-attributes.align');
      case 'background':
        return generateAnnotation('banned-attributes.background');
      case 'bgcolor':
        return generateAnnotation('banned-attributes.bgcolor');
      case 'border':
      case 'frameborder':
        return generateAnnotation(
          'banned-attributes.frameborder',
          {attribute: error.data.attribute}
        );
      case 'marginwidth':
        return generateAnnotation('banned-attributes.marginwidth');
      case 'marginheight':
        return generateAnnotation('banned-attributes.marginheight');
      case 'scrolling':
        return generateAnnotation('banned-attributes.scrolling');
      case 'width':
        return generateAnnotation('banned-attributes.width');
    }
  },

  E002: function() {
    return generateAnnotation('lower-case-attribute-name');
  },

  E005: function(error) {
    return generateAnnotation(
      'attribute-quotes',
      {attribute: error.data.attribute}
    );
  },

  E006: function() {
    return generateAnnotation('attribute-value');
  },

  E007: function() {
    return generateAnnotation('doctype');
  },

  E008: function() {
    return generateAnnotation('doctype');
  },

  E012: function(error) {
    return generateAnnotation('duplicated-id', {id: error.data.id});
  },

  E014: function() {
    return generateAnnotation('img-src');
  },

  E016: function(error) {
    switch (error.data.tag.toLowerCase()) {
      case 'b':
        return generateAnnotation('deprecated-tag.b');
      case 'big':
        return generateAnnotation('deprecated-tag.big');
      case 'center':
        return generateAnnotation('deprecated-tag.center');
      case 'font':
        return generateAnnotation('deprecated-tag.font');
      case 'i':
        return generateAnnotation('deprecated-tag.i');
      case 'strike':
        return generateAnnotation('deprecated-tag.strike');
      case 'tt':
        return generateAnnotation('deprecated-tag.tt');
    }
  },

  E017: function() {
    return generateAnnotation('lower-case-tag-name');
  },

  E027: function() {
    return generateAnnotation('missing-title');
  },

  E028: function() {
    return generateAnnotation('duplicated-title');
  },
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
    'width',
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
    'big',
    'center',
    'font',
    'i',
    'tt',
    'strike',
  ],
  'tag-name-match': true,
  'tag-name-lowercase': true,
  'title-max-length': 0,
  'title-no-dup': true,
};

function generateAnnotation(reason, properties, suppresses) {
  var message = i18n.t('errors.html.' + reason, properties);
  return {
    raw: message,
    text: message,
    reason: reason,
    suppresses: suppresses,
  };
}

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.code)) {
    var annotation = humanErrors[error.code](error);

    return lodash.assign(annotation, {
      row: error.line - 1, column: error.column - 1,
      type: 'error',
    });
  }
}

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
  });
};
