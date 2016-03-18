import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import i18n from 'i18next-client';
import installDevTools from 'immutable-devtools';
import {readFileSync} from 'fs';
import path from 'path';
import Application from './components/Application';
import 'babel-polyfill';

const translations = {
  en: {
    translation: JSON.parse(readFileSync(
      path.join(__dirname, '/../locales/en/translation.json')
    )),
  },
};

i18n.init({
  fallbackLng: 'en',
  debug: true,
  resStore: translations,
});

installDevTools(Immutable);

ReactDOM.render(
  React.createElement(Application),
  document.getElementById('main')
);
