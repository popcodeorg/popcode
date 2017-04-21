import capitalize from 'lodash/capitalize';

const vowelishLetters = new Set(['a', 'e', 'i', 'o', 'u', 'h']);

const formatters = {
  'en-handle-an': val => getVariationOfAOrAn(val, false),
  capitalize: val => capitalize(val),
};

function getVariationOfAOrAn(value) {
  return vowelishLetters.has(value.substring(0, 1)) ? 'an' : 'a';
}

export default function applyCustomI18nFormatters(value, format) {
  return format.split('|').reduce((acc, val) => formatters[val](acc), value);
}
