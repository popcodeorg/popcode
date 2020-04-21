import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';

import config from '../config';
import {getCurrentProject} from '../selectors';

let store;

export const bugsnagClient = bugsnag({
  apiKey: config.bugsnagApiKey,
  appVersion: config.gitRevision,
  releaseStage: config.nodeEnv,
  autoCaptureSessions: true,
  beforeSend(payload) {
    if (!store) {
      return;
    }

    const state = store.getState();
    if (state.get('user')) {
      payload.user = state.get('user').toJS();
    } else {
      payload.user = {id: 'anonymous'};
    }

    payload.metaData.remoteConfig = state.getIn(['ui', 'remoteConfig']).toJS();

    const currentProject = getCurrentProject(state);
    if (currentProject) {
      payload.metaData.currentProject = currentProject;
    }
  },
});

bugsnagClient.use(bugsnagReact, React);
export const ErrorBoundary = bugsnagClient.getPlugin('react');

export function includeStoreInBugReports(storeIn) {
  store = storeIn;
}
