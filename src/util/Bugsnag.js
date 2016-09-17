import 'bugsnag-js';
import isError from 'lodash/isError';
import isString from 'lodash/isString';
import config from '../config';

const Bugsnag = window.Bugsnag.noConflict();
Bugsnag.apiKey = config.bugsnagApiKey;
Bugsnag.releaseStage = config.nodeEnv;
Bugsnag.appVersion = config.gitRevision;

export function includeStoreInBugReports(store) {
  Bugsnag.beforeNotify = (payload) => {
    const state = store.getState();
    if (state.user) {
      payload.user = state.user.toJS();
    } else {
      payload.user = {id: 'anonymous'};
    }

    if (state.currentProject && state.currentProject.get('projectKey')) {
      payload.metaData.currentProject =
        state.projects.get(state.currentProject.get('projectKey')).toJS();
    }
  };
}

window.addEventListener('unhandledrejection', ({reason}) => {
  if (isError(reason)) {
    Bugsnag.notifyException(reason);
  } else if (isString(reason)) {
    Bugsnag.notify('UnhandledRejection', reason);
  } else {
    Bugsnag.notify(
      'UnhandledRejection',
      'Unhandled rejection in promise',
      reason
    );
  }
});

export default Bugsnag;
