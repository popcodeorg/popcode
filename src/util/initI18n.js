import i18n from 'i18next';
import resources from '../../locales';

export default function() {
  i18n.init({
    fallbackLng: 'en',
    resources,
  });
}
