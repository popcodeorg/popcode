import {init} from 'i18next';
import resources from '../../locales';

function getVariationOfAOrAn(value) {
  const vowelishLetters = ['a', 'e', 'i', 'o', 'u', 'h'];
  const isVowelish = vowelishLetters.find(l => value.substring(0, 1) === l);
  return isVowelish ? 'an' : 'a';
}

/*
Arguments:
value:   The value of the variable that is being passed
  in to be interpolated into the localized string
format:  the pipe-delimited list of formatting flags,
  it will run the formatting functions sequentially
  based on the sequence of the flags passed in.
lng: the language used for the formatting
NOTE: lng is available but is not currently used, so I've removed
it from the arguments list.
*/

function formatFunc(value, format) {
  let newVal = value;
  const formatFlags = format.split('|');
  formatFlags.forEach((flag) => {
    // replace the value of the input value with our new value("a" or "an")
    if (flag === 'en-handle-an') {
      newVal = getVariationOfAOrAn(newVal, false);
    } else if (flag === 'capitalize') {
      newVal = newVal.charAt(0).toUpperCase() + newVal.slice(1);
    }
  });
  return newVal;
}

export default function() {
  init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: formatFunc,
    },
  });
}
