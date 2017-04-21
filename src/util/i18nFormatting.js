function getVariationOfAOrAn(value) {
  const vowelishLetters = ['a', 'e', 'i', 'o', 'u', 'h'];
  const isVowelish = vowelishLetters.find(l => value.substring(0, 1) === l);
  return isVowelish ? 'an' : 'a';
}

// eslint-disable-next-line no-unused-vars
export default function(value, format, lng) {
  let newVal = value;
  const formatFlags = format.split('|');
  formatFlags.forEach((flag) => {
    if (flag === 'en-handle-an') {
      newVal = getVariationOfAOrAn(newVal, false);
    } else if (flag === 'capitalize') {
      newVal = newVal.charAt(0).toUpperCase() + newVal.slice(1);
    }
  });
  return newVal;
}
