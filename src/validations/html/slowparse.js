var i18n = require('i18next-client');
var Slowparse = require('slowparse/src');
var assign = require('lodash/assign');

var humanErrors = {
  ATTRIBUTE_IN_CLOSING_TAG: function(error) {
    return generateAnnotation(
      'attribute-in-closing-tag',
      {tag: error.closeTag.name}
    );
  },

  CLOSE_TAG_FOR_VOID_ELEMENT: function(error) {
    return generateAnnotation(
      'close-tag-for-void-element',
      {tag: error.closeTag.name}
    );
  },

  HTML_CODE_IN_CSS_BLOCK: function() {
    return generateAnnotation('html-in-css-block');
  },

  INVALID_ATTR_NAME: function(error) {
    return generateAnnotation(
      'invalid-attribute-name',
      {attribute: error.attribute.name.value},
      ['lower-case-attribute-name']
    );
  },

  INVALID_TAG_NAME: function(error) {
    return generateAnnotation(
      'invalid-tag-name',
      {tag: error.openTag.name}
    );
  },

  UNSUPPORTED_ATTR_NAMESPACE: function(error) {
    return generateAnnotation(
      'invalid-attribute-name',
      {attribute: error.attribute.name.value},
      ['lower-case-attribute-name']
    );
  },

  MULTIPLE_ATTR_NAMESPACES: function(error) {
    return generateAnnotation(
      'invalid-attribute-name',
      {attribute: error.attribute.name.value},
      ['lower-case-attribute-name']
    );
  },

  MISMATCHED_CLOSE_TAG: function(error) {
    return generateAnnotation(
      'mismatched-close-tag',
      {open: error.openTag.name, close: error.closeTag.name}
    );
  },

  SELF_CLOSING_NON_VOID_ELEMENT: function(error) {
    return generateAnnotation(
      'self-closing-non-void-element',
      {tag: error.name}
    );
  },

  UNCLOSED_TAG: function(error) {
    return generateAnnotation(
      'unclosed-tag',
      {tag: error.openTag.name}
    );
  },

  UNEXPECTED_CLOSE_TAG: function(error) {
    return generateAnnotation(
      'unexpected-close-tag',
      {tag: error.closeTag.name}
    );
  },

  UNTERMINATED_ATTR_VALUE: function(error) {
    return generateAnnotation(
      'unterminated-attribute-value',
      {attribute: error.attribute.name.value, tag: error.openTag.name}
    );
  },

  UNTERMINATED_OPEN_TAG: function(error) {
    return generateAnnotation(
      'unterminated-open-tag',
      {tag: error.openTag.name},
      ['attribute-value', 'lower-case']
    );
  },

  UNTERMINATED_CLOSE_TAG: function(error) {
    return generateAnnotation(
      'unterminated-close-tag',
      {tag: error.closeTag.name}
    );
  },

  UNTERMINATED_COMMENT: function() {
    return generateAnnotation('unterminated-comment');
  },

  UNBOUND_ATTRIBUTE_VALUE: function(error) {
    return generateAnnotation(
      'unbound-attribute-value',
      {value: error.value},
      ['attribute-value', 'lower-case-attribute-name']
    );
  },
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

function convertErrorToAnnotation(source, error) {
  if (humanErrors.hasOwnProperty(error.type)) {
    var annotation = humanErrors[error.type](error);
    var lines = source.slice(0, error.cursor).split('\n');
    var row = lines.length - 1;
    var column = lines[row].length - 1;

    return assign(annotation, {
      row: row, column: column,
      type: 'error',
    });
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
