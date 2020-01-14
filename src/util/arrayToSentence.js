import arrayToSentence from 'array-to-sentence';
import i18next from 'i18next';

export function localizedArrayToSentence(array) {
  return arrayToSentence(array, {lastSeparator: i18next.t('utility.or')});
}
