import i18next from 'i18next';
import arrayToSentence from 'array-to-sentence';

export function localizedArrayToSentence(array) {
  return arrayToSentence(array, {lastSeparator: i18next.t('utility.or')});
}
