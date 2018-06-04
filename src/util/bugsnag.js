import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';
import React from 'react';

import config from '../config';
import {getCurrentProject} from '../selectors';

let store;

export const bugsnagClient = bugsnag({
  apiKey: config.bugsnagApiKey,
  appVersion: config.gitRevision,
  releaseStage: config.nodeEnv,
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

    const currentProject = getCurrentProject(state);
    if (currentProject) {
      payload.metaData.currentProject = currentProject;
    }
  },
});

export const ErrorBoundary = bugsnagClient.use(createPlugin(React));

export function includeStoreInBugReports(storeIn) {
  store = storeIn;
}
