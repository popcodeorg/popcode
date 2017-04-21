import {t} from 'i18next';
import initTestI18n from './initTestI18n';
import test from 'tape';

initTestI18n();

test('i18n-should return the localized phrase when key is passed in', (p) => {    
    const key = 'simple-key';
    const expected = 'test string';
    const result = t(key);

    p.equal(expected, result);
    p.end();
});

test(`i18n-should transform variable into "a"
  when the first letter of the passed variable is non-vowelish`, (p) => {
    const key = 'key-with-an-format';
    const options = {tag: 'section'};
    const expected = 'string with a section';
    const result = t(key, options);

    p.equal(expected, result);
    p.end();
});

test(`i18n-should transform variable into "an" 
  when the first letter of the passed variable is vowelish`, (p) => {
    const key = 'key-with-an-format';
    const options = {tag: 'h1'};
    const expected = 'string with an h1';
    const result = t(key, options);

    p.equal(expected, result);
    p.end();
});

test(`i18n-should capitalize the passed variable 
  when it is passed in with a capitalize format flag`, (p) => {
    const key = 'key-with-capitalize-format';
    const options = {tag: 'section'};
    const expected = 'Section';
    const result = t(key, options);

    p.equal(expected, result);
    p.end();
});

test(`i18n-should do a/an replace and capitalize the passed variable 
  when it is passed in with 2 flags`, (p) => {
    const key = 'key-with-multiple-formats';
    const options = {tag: 'section'};
    const expected = 'string with A section';
    const result = t(key, options);

    p.equal(expected, result);
    p.end();
});