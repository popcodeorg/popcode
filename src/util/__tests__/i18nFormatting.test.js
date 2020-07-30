import i18next from 'i18next';
import tap from 'lodash-es/tap';

import applyCustomI18nFormatters from '../i18nFormatting';

function localizationTest(instance, key, options, expected) {
  return () => {
    const actual = instance.t(key, options);

    expect(actual).toEqual(expected);
  };
}

const enTestResourceData = {
  'simple-key': 'test string',
  'key-with-an-format': 'string with {{tag, en-handle-an}} {{tag}}',
  'key-with-capitalize-format': '{{tag, capitalize}}',
  'key-with-multiple-formats':
    'string with {{tag, en-handle-an|capitalize}} {{tag}}',
  'key-invalid-formatter': '{{tag, invalid}}',
  'key-invalid-and-valid-formatter': '{{tag, invalid|capitalize}}',
};

function getI18nInstance() {
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

  return tap(i18next.createInstance(options), instance => instance.init());
}

const instance = getI18nInstance();

describe('i18n', () => {
  test(
    'simple key',
    localizationTest(instance, 'simple-key', {}, 'test string'),
  );

  test(
    'en-handle-an formatter with non-vowelish value',
    localizationTest(
      instance,
      'key-with-an-format',
      {tag: 'section'},
      'string with a section',
    ),
  );

  test(
    'en-handle-an formatter with vowelish value',
    localizationTest(
      instance,
      'key-with-an-format',
      {tag: 'h1'},
      'string with an h1',
    ),
  );

  test(
    'capitalize formatter',
    localizationTest(
      instance,
      'key-with-capitalize-format',
      {tag: 'section'},
      'Section',
    ),
  );

  test(
    'compose formatters',
    localizationTest(
      instance,
      'key-with-multiple-formats',
      {tag: 'section'},
      'string with A section',
    ),
  );

  test(
    'invalid formatter',
    localizationTest(
      instance,
      'key-invalid-formatter',
      {tag: 'section'},
      'section',
    ),
  );

  test(
    'invalid and valid formatter',
    localizationTest(
      instance,
      'key-invalid-and-valid-formatter',
      {tag: 'Section'},
      'Section',
    ),
  );
});
