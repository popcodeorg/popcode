/* eslint-env mocha */
import {assert} from 'chai';
import {t} from 'i18next';
import initTestI18n from './initTestI18n';

initTestI18n();

describe('i18n', () => {
  it('should return the localized phrase when key is passed in', () => {
    const key = 'simple-key';
    const expected = 'test string 1';
    const result = t(key);
    assert.isTrue(result === expected);
  });

  it(`should transform variable into "a"
  when the first letter of the passed variable is non-vowelish`, () => {
    const key = 'key-with-an-format';
    const options = {tag: 'section'};
    const expected = 'string with a section';
    const result = t(key, options);
    assert.isTrue(expected === result);
  });

  it(`should transform variable into "an" 
  when on the first letter of the passed variable is vowelish`, () => {
    const key = 'key-with-an-format';
    const options = {tag: 'h1'};
    const expected = 'string with an h1';
    const result = t(key, options);
    assert.isTrue(expected === result);
  });

  it(`should capitalize the passed variable 
  when it is passed in with a capitalize format flag`, () => {
    const key = 'key-with-capitalize-format';
    const options = {tag: 'section'};
    const expected = 'Section';
    const result = t(key, options);
    assert.isTrue(result === expected);
  });

  it(`should do a/an replace and capitalize the passed variable 
  when it is passed 2 flags`, () => {
    const key = 'key-with-multiple-formats';
    const options = {tag: 'section'};
    const expected = 'string with A section';
    const result = t(key, options);
    assert.isTrue(result === expected);
  });
});
