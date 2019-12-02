import Immutable from 'immutable';
import {handleActions} from 'redux-actions';

import {
  createSnapshot,
  snapshotCreated,
  snapshotExportError,
  exportProject,
  projectExported,
  projectExportError,
  gapiClientReady,
} from '../actions/clients';
import {
  createAssignment,
  assignmentCreated,
  assignmentNotCreated,
} from '../actions/assignments';

const defaultState = new Immutable.Map({
  firebase: new Immutable.Map({exportingSnapshot: false}),
  projectExports: new Immutable.Map(),
  exportingAssignment: false,
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
    [createAssignment]: state => {
      return state.setIn(['exportingAssignment'], true);
    },
    [createAssignment]: state => {
      return state.setIn(['exportingAssignment'], true);
    },
    [assignmentCreated]: state => {
      return state.setIn(['exportingAssignment'], false);
    },
    [assignmentNotCreated]: state => {
      return state.setIn(['exportingAssignment'], false);
    },
  },
  defaultState,
);
