const formatFlags = {
  EN_HANDLE_AN: 'en-handle-an',
  CAPITALIZE: 'capitalize'
}

function getVariationOfAOrAn(value) {
  const vowelishLetters = ['a', 'e', 'i', 'o', 'u', 'h'];
  const isVowelish = vowelishLetters.find(l => value.substring(0, 1) === l);
  return isVowelish ? 'an' : 'a';
}

// eslint-disable-next-line no-unused-vars
export default function(value, format, lng) {
  let newVal = value;
  const inputFlags = format.split('|');
  inputFlags.forEach((flag) => {
    if (flag === formatFlags.EN_HANDLE_AN) {
      newVal = getVariationOfAOrAn(newVal, false);
    } else if (flag === formatFlags.CAPITALIZE) {
      newVal = newVal.charAt(0).toUpperCase() + newVal.slice(1);
    }
  });
  return newVal;
}
