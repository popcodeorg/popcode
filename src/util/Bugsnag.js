import 'bugsnag-js';
import config from '../config';

const Bugsnag = window.Bugsnag.noConflict();
Bugsnag.apiKey = config.bugsnagApiKey;
Bugsnag.releaseStage = config.nodeEnv;

function includeStoreInBugReports(store) {
  Bugsnag.beforeNotify = (payload) => {
    const state = store.getState();
    if (state.user) {
      payload.user = state.user.toJS();
    } else {
      payload.user = {id: 'anonymous'};
    }

    const metaData = {};
    if (state.currentProject && state.currentProject.get('projectKey')) {
      metaData.currentProject =
        state.projects.get(state.currentProject.get('projectKey')).toJS();
    }

    payload.metaData = metaData;
  };
}

export default Bugsnag;
export {includeStoreInBugReports};
