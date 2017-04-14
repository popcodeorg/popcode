import {init} from 'i18next';
import resources from '../../locales';
import formatFunc from './i18nFormatting';

export default function() {
  init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      format: formatFunc,
    },
  });
}
