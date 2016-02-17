import i18n from 'i18next-client';
import css from 'css';
import {Promise} from 'es6-promise';

const humanErrors = {
  'missing \'}\'': () => i18n.t('errors.css.missing-curly'),

  'property missing \':\'': () => i18n.t('errors.css.property-missing-colon'),

  'selector missing': () => i18n.t('errors.css.selector-missing'),
};

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.reason)) {
    const message = humanErrors[error.reason](error);
    return {
      row: error.line - 1, column: error.column - 1,
      raw: message,
      text: message,
      type: 'error',
    };
  }

  return null;
}

export default (source) => {
  const result = css.parse(source, {silent: true}).stylesheet;
  const annotations = [];
  result.parsingErrors.forEach((error) => {
    const annotation = convertErrorToAnnotation(error);
    if (annotation !== null) {
      annotations.push(annotation);
    }
  });
  return Promise.resolve(annotations);
};
