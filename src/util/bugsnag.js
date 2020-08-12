import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';

import config from '../config';
import {LoginState} from '../enums';

import {getCurrentProject} from '../selectors';

let store;

export const bugsnagClient = Bugsnag.start({
  apiKey: config.bugsnagApiKey,
  appVersion: config.gitRevision,
  autoCaptureSessions: true,
  onError(event) {
    if (!store) {
      return;
    }

    const state = store.getState();
    const user = state.get('user');
    if (user.loginState === LoginState.AUTHENTICATED) {
      const {id, displayName} = user.account;
      event.setUser(id, undefined, displayName);
    } else if (user.loginState === LoginState.ANONYMOUS) {
      event.setUser('anonymous');
    }

    event.addMetadata(
      'remoteConfig',
      state.getIn(['ui', 'remoteConfig']).toJS(),
    );

    const currentProject = getCurrentProject(state);
    if (currentProject) {
      event.addMetadata('currentProject', currentProject);
    }
  },
  plugins: [new BugsnagPluginReact()],
  releaseStage: config.nodeEnv,
});

export const ErrorBoundary = bugsnagClient
  .getPlugin('react')
  .createErrorBoundary(React);

export function includeStoreInBugReports(storeIn) {
  store = storeIn;
}
