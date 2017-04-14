import {init} from 'i18next';
import resources from '../../locales';

// value:   The value of the variable that is being passed in to be interpolated into the localized string
// format:  the pipe-delimited list of formatting flags, it will run the formatting functions sequentially
//          based on the sequence of the flags passed in.
// lng:     the language used for the formatting 
const format = (value, format, lng) => {
  const formatFlags = format.split('|');    
  formatFlags.forEach(flag => {
    // replace the value of the input value with our new value("a" or "an")
    if (flag === 'en-handle-an') {
      value = getVariationOfAOrAn(value, false);
    }
    else if (flag === 'capitalize') {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    } 
  })
  return value;
}

const getVariationOfAOrAn = function(value, capitalize) {
  const isVowelish = ['a','e','i','o','u','h'].find((l) => {return value.substring(0,1) === l;}) 
  return isVowelish ? 'an' : 'a';
}

export default function() {
  init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: format
    }
  });
}
