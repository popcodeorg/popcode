import {init} from 'i18next';
import resources from '../../locales';

export default function() {
  init({
    fallbackLng: 'en',
    resources,
  });
}
