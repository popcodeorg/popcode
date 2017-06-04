import './init';
import './util/Bugsnag';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import Application from './components/Application';
import initI18n from './util/initI18n';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import {init as initAnalytics, logPageview} from './clients/googleAnalytics';

installDevTools(Immutable);
OfflinePluginRuntime.install({
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    runtime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },

  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  }
});

initI18n();
initAnalytics();
logPageview();

ReactDOM.render(
  React.createElement(Application),
  document.getElementById('main'),
);
