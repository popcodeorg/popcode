import {init} from 'i18next';
import formatFunc from '../../../src/util/i18nFormatting';

// There is an issue when loading json directly that gives an error
// saying it is not valid javascript.  I believe it may be due to
// reusing the webpack config object, but I'm not sure.
// https://github.com/webpack-contrib/json-loader/issues/13

// eslint-disable-next-line import/no-webpack-loader-syntax
import enTestResourceFile from '!json-loader!./test-translation.json';

export default function() {
  // put the locale into the correct namespace for the i18n cache.
  // Because we are adding it to the cache manually,
  // we have to give it the hierarchy manually
  const namespacedLocaleObject = {
    en: {
      translation: enTestResourceFile,
    },
  };

  const options = {
    // the localized data, adding directly to the cache
    resources: namespacedLocaleObject,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      format: formatFunc,
    },
  };

  // initialize the i18n cache
  init(options);
}
