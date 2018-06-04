import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import {install as installOfflinePlugin} from 'offline-plugin/runtime';

import {bugsnagClient} from './util/bugsnag';
import Application from './components/Application';
import initI18n from './util/initI18n';
import {init as initAnalytics, logPageview} from './clients/googleAnalytics';

installDevTools(Immutable);
installOfflinePlugin({
  onUpdateFailed() {
    bugsnagClient.notify('ServiceWorker update failed');
  },
});

initI18n();
initAnalytics();
logPageview();

ReactDOM.render(
  React.createElement(Application),
  document.getElementById('main'),
);
