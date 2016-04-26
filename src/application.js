import './util/Bugsnag';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import Application from './components/Application';
import initI18n from './util/initI18n';
import 'babel-polyfill';

installDevTools(Immutable);

initI18n();

ReactDOM.render(
  React.createElement(Application),
  document.getElementById('main')
);
