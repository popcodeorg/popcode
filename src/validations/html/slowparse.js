import i18n from 'i18next-client';
import Slowparse from 'slowparse/src';
import assign from 'lodash/assign';

const humanErrors = {
  ATTRIBUTE_IN_CLOSING_TAG: (error) => generateAnnotation(
    'attribute-in-closing-tag',
    {tag: error.closeTag.name}
  ),

  CLOSE_TAG_FOR_VOID_ELEMENT: (error) => generateAnnotation(
    'close-tag-for-void-element',
    {tag: error.closeTag.name}
  ),

  HTML_CODE_IN_CSS_BLOCK: () => generateAnnotation('html-in-css-block'),

  INVALID_ATTR_NAME: (error) => generateAnnotation(
    'invalid-attribute-name',
    {attribute: error.attribute.name.value},
    ['lower-case-attribute-name']
  ),

  INVALID_TAG_NAME: (error) => generateAnnotation(
    'invalid-tag-name',
    {tag: error.openTag.name}
  ),

  UNSUPPORTED_ATTR_NAMESPACE: (error) => generateAnnotation(
    'invalid-attribute-name',
    {attribute: error.attribute.name.value},
    ['lower-case-attribute-name']
  ),

  MULTIPLE_ATTR_NAMESPACES: (error) => generateAnnotation(
    'invalid-attribute-name',
    {attribute: error.attribute.name.value},
    ['lower-case-attribute-name']
  ),

  MISMATCHED_CLOSE_TAG: (error) => generateAnnotation(
    'mismatched-close-tag',
    {open: error.openTag.name, close: error.closeTag.name}
  ),

  SELF_CLOSING_NON_VOID_ELEMENT: (error) => generateAnnotation(
    'self-closing-non-void-element',
    {tag: error.name}
  ),

  UNCLOSED_TAG: (error) => generateAnnotation(
    'unclosed-tag',
    {tag: error.openTag.name}
  ),

  UNEXPECTED_CLOSE_TAG: (error) => generateAnnotation(
    'unexpected-close-tag',
    {tag: error.closeTag.name}
  ),

  UNTERMINATED_ATTR_VALUE: (error) => generateAnnotation(
    'unterminated-attribute-value',
    {attribute: error.attribute.name.value, tag: error.openTag.name}
  ),

  UNTERMINATED_OPEN_TAG: (error) => generateAnnotation(
    'unterminated-open-tag',
    {tag: error.openTag.name},
    ['attribute-value', 'lower-case', 'lower-case-attribute-name']
  ),

  UNTERMINATED_CLOSE_TAG: (error) => generateAnnotation(
    'unterminated-close-tag',
    {tag: error.closeTag.name}
  ),

  UNTERMINATED_COMMENT: () => generateAnnotation('unterminated-comment'),

  UNBOUND_ATTRIBUTE_VALUE: (error) => generateAnnotation(
    'unbound-attribute-value',
    {value: error.value},
    ['attribute-value', 'lower-case-attribute-name']
  ),
};

function generateAnnotation(reason, properties, suppresses) {
  const message = i18n.t(`errors.html.${reason}`, properties);
  return {
    raw: message,
    text: message,
    reason,
    suppresses,
  };
}

function convertErrorToAnnotation(source, error) {
  if (humanErrors.hasOwnProperty(error.type)) {
    const annotation = humanErrors[error.type](error);
    const lines = source.slice(0, error.cursor).split('\n');
    const row = lines.length - 1;
    const column = lines[row].length - 1;

    return assign(annotation, {
      row, column,
      type: 'error',
    });
  }

  return null;
}

export default (source) => {
  const error = Slowparse.HTML(document, source).error;
  if (error !== null) {
    const annotation = convertErrorToAnnotation(source, error);
    if (annotation !== null) {
      return Promise.resolve([annotation]);
    }
  }

  return Promise.resolve([]);
};
