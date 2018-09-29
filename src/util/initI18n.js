import {init} from 'i18next';

import resources from '../../locales';

import applyCustomI18nFormatters from './i18nFormatting';

export default function initI18n() {
  init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: applyCustomI18nFormatters,
    },
  });
}
