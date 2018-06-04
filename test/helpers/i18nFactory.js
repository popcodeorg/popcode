import {createInstance} from 'i18next';

import applyCustomI18nFormatters from '../../src/util/i18nFormatting';

const enTestResourceData = {
  'simple-key': 'test string',
  'key-with-an-format': 'string with {{tag, en-handle-an}} {{tag}}',
  'key-with-capitalize-format': '{{tag, capitalize}}',
  'key-with-multiple-formats':
  'string with {{tag, en-handle-an|capitalize}} {{tag}}',
  'key-invalid-formatter': '{{tag, invalid}}',
  'key-invalid-and-valid-formatter': '{{tag, invalid|capitalize}}',
};

export default function getI18nInstance() {
  const namespacedLocaleObject = {
    en: {
      translation: enTestResourceData,
    },
  };

  const options = {
    resources: namespacedLocaleObject,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      format: applyCustomI18nFormatters,
    },
  };

  return createInstance(options).init();
}
