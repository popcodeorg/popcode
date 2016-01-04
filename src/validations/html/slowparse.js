var i18n = require('i18next-client');
var Slowparse = require('slowparse/src');

var humanErrors = {
  ATTRIBUTE_IN_CLOSING_TAG: function(error) {
    return i18n.t(
      'errors.html.attribute-in-closing-tag',
      {tag: error.closeTag.name}
    );
  },

  CLOSE_TAG_FOR_VOID_ELEMENT: function(error) {
    return i18n.t(
      'errors.html.close-tag-for-void-element',
      {tag: error.closeTag.name}
    );
  },

  HTML_CODE_IN_CSS_BLOCK: function() {
    return i18n.t('errors.html.html-in-css-block');
  },

  INVALID_ATTR_NAME: function(error) {
    return i18n.t(
      'errors.html.invalid-attribute-name',
      {attribute: error.attribute.name.value}
    );
  },

  UNSUPPORTED_ATTR_NAMESPACE: function(error) {
    return i18n.t(
      'errors.html.invalid-attribute-name',
      {attribute: error.attribute.name.value}
    );
  },

  MULTIPLE_ATTR_NAMESPACES: function(error) {
    return i18n.t(
      'errors.html.invalid-attribute-name',
      {attribute: error.attribute.name.value}
    );
  },

  MISMATCHED_CLOSE_TAG: function(error) {
    return i18n.t(
      'errors.html.mismatched-close-tag',
      {open: error.openTag.name, close: error.closeTag.name}
    );
  },

  SELF_CLOSING_NON_VOID_ELEMENT: function(error) {
    return i18n.t(
      'errors.html.self-closing-non-void-element',
      {tag: error.name}
    );
  },

  UNCLOSED_TAG: function(error) {
    return i18n.t(
      'errors.html.unclosed-tag',
      {tag: error.openTag.name}
    );
  },

  UNEXPECTED_CLOSE_TAG: function(error) {
    return i18n.t(
      'errors.html.unexpected-close-tag',
      {tag: error.closeTag.name}
    );
  },

  UNTERMINATED_ATTR_VALUE: function(error) {
    return i18n.t(
      'errors.html.unterminated-attribute-value',
      {attribute: error.attribute.name.value, tag: error.openTag.name}
    );
  },

  UNTERMINATED_OPEN_TAG: function(error) {
    return i18n.t(
      'errors.html.unterminated-open-tag',
      {tag: error.openTag.name}
    );
  },

  UNTERMINATED_CLOSE_TAG: function(error) {
    return i18n.t(
      'errors.html.unterminated-close-tag',
      {tag: error.closeTag.name}
    );
  },

  UNTERMINATED_COMMENT: function() {
    return i18n.t('errors.html.unterminated-comment');
  },

  UNBOUND_ATTRIBUTE_VALUE: function(error) {
    return i18n.t(
      'errors.html.unbound-attribute-value',
      {value: error.value}
    );
  },
};

function convertErrorToAnnotation(source, error) {
  if (humanErrors.hasOwnProperty(error.type)) {
    var message = humanErrors[error.type](error);
    var lines = source.slice(0, error.cursor).split('\n');
    var row = lines.length - 1;
    var column = lines[row].length - 1;

    return {
      row: row, column: column,
      raw: message,
      text: message,
      type: 'error',
    };
  }
}

module.exports = function(source) {
  var error = Slowparse.HTML(document, source).error;
  if (error !== null) {
    var annotation = convertErrorToAnnotation(source, error);
    if (annotation !== undefined) {
      return Promise.resolve([annotation]);
    }
  }

  return Promise.resolve([]);
};
