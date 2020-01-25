import Immutable from 'immutable';
import {handleActions} from 'redux-actions';

import {
  createSnapshot,
  exportProject,
  gapiClientReady,
  projectExported,
  projectExportError,
  snapshotCreated,
  snapshotExportError,
} from '../actions/clients';

const defaultState = new Immutable.Map({
  firebase: new Immutable.Map({exportingSnapshot: false}),
  projectExports: new Immutable.Map(),
  gapi: new Immutable.Map({ready: false}),
});

export default handleActions(
  {
    [createSnapshot]: state => {
      return state.setIn(['firebase', 'exportingSnapshot'], true);
    },
    [snapshotCreated]: state => {
      return state.setIn(['firebase', 'exportingSnapshot'], false);
    },
    [snapshotExportError]: state => {
      return state.setIn(['firebase', 'exportingSnapshot'], false);
    },
    [exportProject]: (state, action) => {
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'waiting'}),
      );
    },
    [projectExported]: (state, action) => {
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'ready', url: action.payload.url}),
      );
    },
    [projectExportError]: (state, action) => {
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'error'}),
      );
    },
    [gapiClientReady]: state => {
      return state.setIn(['gapi', 'ready'], true);
    },
  },
  defaultState,
);
