import i18n from 'i18next-client';

import EN from '../../locales/en.json';

const translations = {
  en: {
    translation: EN,
  },
};

function initI18n() {
  i18n.init({
    fallbackLng: 'en',
    debug: true,
    resStore: translations,
  });
}

export default initI18n;
