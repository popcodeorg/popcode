var i18n = require('i18next-client');
var htmllint = require('htmllint');

var humanErrors = {
  'E001': function(error) {
    switch(error.data.attribute.toLowerCase()) {
      case 'align':
        return i18n.t('errors.html.banned-attributes.align');
      case 'background':
        return i18n.t('errors.html.banned-attributes.background');
      case 'bgcolor':
        return i18n.t('errors.html.banned-attributes.bgcolor');
      case 'border':
      case 'frameborder':
        return i18n.t(
          'errors.html.banned-attributes.frameborder',
          {attribute: error.data.attribute}
        );
      case 'marginwidth':
        return i18n.t('errors.html.banned-attributes.marginwidth');
      case 'marginheight':
        return i18n.t('errors.html.banned-attributes.marginheight');
      case 'scrolling':
        return i18n.t('errors.html.banned-attributes.scrolling');
      case 'width':
        return i18n.t('errors.html.banned-attributes.width');
    }
  },

  'E002': function() {
    return i18n.t('errors.html.lower-case');
  },

  'E005': function(error) {
    return i18n.t(
      'errors.html.attribute-quotes',
      {attribute: error.data.attribute}
    );
  },

  'E006': function() {
    return i18n.t('errors.html.attribute-value');
  },

  'E007': function() {
    return i18n.t('errors.html.doctype');
  },

  'E008': function() {
    return i18n.t('errors.html.doctype');
  },

  'E012': function(error) {
    return i18n.t('errors.html.duplicated-id', {id: error.data.id});
  },

  'E014': function() {
    return i18n.t('errors.html.img-src');
  },

  'E016': function(error) {
    switch (error.data.tag.toLowerCase()) {
      case 'b':
        return i18n.t('errors.html.deprecated-tag.b');
      case 'big':
        return i18n.t('errors.html.deprecated-tag.big');
      case 'center':
        return i18n.t('errors.html.deprecated-tag.center');
      case 'font':
        return i18n.t('errors.html.deprecated-tag.font');
      case 'i':
        return i18n.t('errors.html.deprecated-tag.i');
      case 'strike':
        return i18n.t('errors.html.deprecated-tag.strike');
      case 'tt':
        return i18n.t('errors.html.deprecated-tag.tt');
    }
  },

  'E017': function() {
    return i18n.t('errors.html.lower-case-tag-name');
  },

  'E027': function() {
    return i18n.t('errors.html.missing-title');
  },

  'E028': function() {
    return i18n.t('errors.html.duplicated-title');
  },

  'E030': function() {
    return i18n.t('errors.html.opened-tag');
  },

  'E036': function() {
    return i18n.t('errors.html.indentation');
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

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.code)) {
    var message = humanErrors[error.code](error);
    return {
      row: error.line - 1, column: error.column - 1,
      raw: message,
      text: message,
      type: 'error',
    };
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
