import {createSelector} from 'reselect';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import partition from 'lodash-es/partition';

import {LANGUAGES} from '../util/editor';

import getHiddenUIComponents from './getHiddenUIComponents';

export default createSelector(
  [getHiddenUIComponents],
  hiddenUIComponents => {
    const [hiddenLanguages, visibleLanguages] = partition(
      map(LANGUAGES, (language, index) => ({language, index})),
      ({language}) => includes(hiddenUIComponents, `editor.${language}`),
    );
    return {hiddenLanguages, visibleLanguages};
  },
);
