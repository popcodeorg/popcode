import {init} from 'i18next';
import formatFunc from '../../../src/util/i18nFormatting';

const enTestResourceData = {
  "simple-key": "test string",
  "key-with-an-format": "string with {{tag, en-handle-an}} {{tag}}",
  "key-with-capitalize-format": "{{tag, capitalize}}",
  "key-with-multiple-formats": "string with {{tag, en-handle-an|capitalize}} {{tag}}"   
}

export default function() {
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
      format: formatFunc,
    },
  };

  init(options);
}
