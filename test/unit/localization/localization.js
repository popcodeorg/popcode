import test from 'tape';

import getI18nInstance from '../../helpers/i18nFactory';
import localizationTest from '../../helpers/localizationTest';

const instance = getI18nInstance();

test('i18n', (t) => {
  t.test('simple key',
    localizationTest(
      instance,
      'simple-key',
      {},
      'test string',
    ));

  t.test('en-handle-an formatter with non-vowelish value',
    localizationTest(
      instance,
      'key-with-an-format',
      {tag: 'section'},
      'string with a section',
    ));

  t.test('en-handle-an formatter with vowelish value',
    localizationTest(
      instance,
      'key-with-an-format',
      {tag: 'h1'},
      'string with an h1',
    ));

  t.test('capitalize formatter',
    localizationTest(
      instance,
      'key-with-capitalize-format',
      {tag: 'section'},
      'Section',
    ));

  t.test('compose formatters',
    localizationTest(
      instance,
      'key-with-multiple-formats',
      {tag: 'section'},
      'string with A section',
    ));

  t.test('invalid formatter',
    localizationTest(
      instance,
      'key-invalid-formatter',
      {tag: 'section'},
      'section',
    ));

  t.test('invalid and valid formatter',
    localizationTest(
      instance,
      'key-invalid-and-valid-formatter',
      {tag: 'Section'},
      'Section',
    ));
});
