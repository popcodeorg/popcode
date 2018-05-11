import capitalize from 'lodash-es/capitalize';
import get from 'lodash-es/get';
import identity from 'lodash-es/identity';

const vowelishLetters = new Set(['a', 'e', 'i', 'o', 'u', 'h']);

const formatters = {
  'en-handle-an': val => getVariationOfAOrAn(val),
  capitalize: val => capitalize(val),
};

function getVariationOfAOrAn(value) {
  return vowelishLetters.has(value.substring(0, 1)) ? 'an' : 'a';
}

export default function applyCustomI18nFormatters(value, format) {
  return format.split('|').reduce((acc, val) =>
    get(formatters, val, identity)(acc), value);
}
