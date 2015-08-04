var i18n = require('i18next-client');
var htmllint = require('htmllint');

var humanErrors = {
  "E001": function(error) {
    switch(error.data.attribute.toLowerCase()) {
      case 'align':
        return i18n.t('html.align');
      case 'background':
        return i18n.t('html.background');
      case 'bgcolor':
        return i18n.t('html.bgcolor');
      case 'border':
      case 'frameborder':
        return i18n.t('html.frameborder', { attribute: error.data.attribute });
      case 'marginwidth':
        return i18n.t('html.marginwidth');
      case 'marginheight':
        return i18n.t('html.marginheight');
      case 'scrolling':
        return i18n.t('html.scrolling');
      case 'width':
        return i18n.t('html.width');
    }
  },

  "E002": function() {
    return i18n.t("html.E002");
  },

  "E005": function(error) {
    return i18n.t("html.E005", { attribute: error.data.attribute });
  },

  "E006": function(error) {
    return i18n.t("html.E006");
  },

  "E007": function() {
    return i18n.t("html.E007");
  },

  "E008": function() {
    return i18n.t("html.E008");
  },

  "E012": function(error) {
    return i18n.t("html.E012", { id: error.data.id });
  },

  "E014": function() {
    return i18n.t("html.E014");
  },

  "E016": function(error) {
    switch (error.data.tag.toLowerCase()) {
      case 'b':
        return i18n.t('html.b');
      case 'big':
        return i18n.t('html.big');
      case 'center':
        return i18n.t('html.center');
      case 'font':
        return i18n.t('html.font');
      case 'i':
        return i18n.t('html.i');
      case 'strike':
        return i18n.t('html.strike');
      case 'tt':
        return i18n.t('html.tt');
    }
  },

  "E017": function() {
    return i18n.t("html.E017")
  },

  "E027": function() {
    return i18n.t("html.E027")
  },

  "E028": function() {
    return i18n.t("html.E028")
  },

  "E030": function() {
    return i18n.t("html.E030")
  },

  "E036": function() {
    return i18n.t("html.E036")
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
    'big',
    'center',
    'font',
    'i',
    'tt',
    'strike'
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
