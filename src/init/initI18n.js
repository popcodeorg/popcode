import i18next from 'i18next';

import resources from '../../locales';

import applyCustomI18nFormatters from '../util/i18nFormatting';

export default function initI18n() {
  i18next.init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: applyCustomI18nFormatters,
    },
  });
}
