import 'bugsnag-js';
import isNull from 'lodash/isNull';
import config from '../config';
import {getCurrentProject} from '../selectors';

const MINIFIED_SOURCE_PATTERN = /firebase\/auth/;

const Bugsnag = window.Bugsnag.noConflict();
Bugsnag.apiKey = config.bugsnagApiKey;
Bugsnag.releaseStage = config.nodeEnv;
Bugsnag.appVersion = config.gitRevision;
Bugsnag.enableNotifyUnhandledRejections();

const bugsnagNotifyMiddleware = {
  store: null,

  beforeNotify(payload) {
    if (MINIFIED_SOURCE_PATTERN.test(payload.stacktrace)) {
      payload.metaData.groupingHash = payload.message;
    }
    this._attachStateToPayload(payload);
  },

  _attachStateToPayload(payload) {
    if (isNull(this.store)) {
      return;
    }

    const state = this.store.getState();
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
};

Bugsnag.beforeNotify =
  bugsnagNotifyMiddleware.beforeNotify.bind(bugsnagNotifyMiddleware);

export function includeStoreInBugReports(store) {
  bugsnagNotifyMiddleware.store = store;
}

export default Bugsnag;
