import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Provider} from 'react-redux';
import i18n from 'i18next-client';
import installDevTools from 'immutable-devtools';
import {readFileSync} from 'fs';
import path from 'path';
import Workspace from './components/Workspace';
import store from './store';
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

ReactDOM.render(React.createElement(
  Provider,
  {store},
  React.createElement(Workspace)
), document.getElementById('main'));
