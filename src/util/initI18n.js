import {init} from 'i18next';

import resources from '../../locales';

import applyCustomI18nFormatters from './i18nFormatting';

export default function() {
  init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: applyCustomI18nFormatters,
    },
  });
}
