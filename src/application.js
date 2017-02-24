import './init';
import './util/Bugsnag';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import Application from './components/Application';
import initI18n from './util/initI18n';
import {init as initAnalytics, logPageview} from './clients/googleAnalytics';

installDevTools(Immutable);

initI18n();
initAnalytics();
logPageview();

ReactDOM.render(
  React.createElement(Application),
  document.getElementById('main'),
);
