import {init} from 'i18next';
import resources from '../../locales';

const getVariationOfAOrAn = function(value, capitalize) {
  const letters = ['a','e','i','o','u','h'];
  let firstLetter = value.substring(0,1);
  let correctWordForm = '';
  if (letters.find(function(l) {
    return firstLetter === l;
  })) {
    correctWordForm = capitalize ? 'An' : 'an';
  } else {
    correctWordForm =  capitalize ? 'A' : 'a';
  }

  return correctWordForm;
}

export default function() {
  init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: function(value, format, lng) {
        if (format === 'en-handle-an') return (!lng || lng === 'en') ? getVariationOfAOrAn(value, false) : '';
        if (format === 'en-handle-an-capitalized') return (!lng || lng === 'en') ? getVariationAOrAn(value, true) : '';
        return value;
      }
    }
  });
}
