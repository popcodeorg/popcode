import 'bugsnag-js';
import isError from 'lodash/isError';
import isString from 'lodash/isString';
import config from '../config';
import {getCurrentProject} from './projectUtils';

const Bugsnag = window.Bugsnag.noConflict();
Bugsnag.apiKey = config.bugsnagApiKey;
Bugsnag.releaseStage = config.nodeEnv;
Bugsnag.appVersion = config.gitRevision;

export function includeStoreInBugReports(store) {
  Bugsnag.beforeNotify = (payload) => {
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
      JSON.stringify(reason) || 'No reason given',
    );
  }
});

export default Bugsnag;
