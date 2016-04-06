import i18n from 'i18next-client';
import {readFileSync} from 'fs';
import path from 'path';

const translations = {
  en: {
    translation: JSON.parse(readFileSync(
      path.join(__dirname, '/../../locales/en.json')
    )),
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
