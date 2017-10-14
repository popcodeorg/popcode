import 'bugsnag-js';
import config from '../config';
import {getCurrentProject} from '../selectors';

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

Bugsnag.enableNotifyUnhandledRejections();

export default Bugsnag;
