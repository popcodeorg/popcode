import Immutable from 'immutable';

const defaultState = new Immutable.Map({
  firebase: new Immutable.Map({exportingSnapshot: false}),
  gists: new Immutable.Map({lastExport: null}),
  classrooms: new Immutable.Map({lastShare: null}),
});

export default function clients(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'CREATE_SNAPSHOT':
      return state.setIn(['firebase', 'exportingSnapshot'], true);

    case 'SNAPSHOT_CREATED':
      return state.setIn(['firebase', 'exportingSnapshot'], false);

    case 'SNAPSHOT_EXPORT_ERROR':
      return state.setIn(['firebase', 'exportingSnapshot'], false);

    case 'EXPORT_GIST':
      return state.setIn(
        ['gists', 'lastExport'],
        new Immutable.Map({status: 'waiting'}),
      );

    case 'GIST_EXPORTED':
      return state.setIn(
        ['gists', 'lastExport'],
        new Immutable.Map({status: 'ready', url: action.payload}),
      );

    case 'GIST_EXPORT_ERROR':
      return state.setIn(
        ['gists', 'lastExport'],
        new Immutable.Map({status: 'error', error: action.payload}),
      );

    case 'EXPORT_REPO':
      return state.setIn(
        ['repos', 'lastExport'],
        new Immutable.Map({status: 'waiting'}),
      );

    case 'REPO_EXPORTED':
      return state.setIn(
        ['repos', 'lastExport'],
        new Immutable.Map({status: 'ready', url: action.payload}),
      );

    case 'REPO_EXPORT_ERROR':
      return state.setIn(
        ['repos', 'lastExport'],
        new Immutable.Map({status: 'error', error: action.payload}),
      );

    case 'SHARE_TO_CLASSROOM':
      return state.setIn(
        ['classrooms', 'lastShare'],
        new Immutable.Map({status: 'waiting'}),
      );

    case 'SHARED_TO_CLASSROOM':
      return state.setIn(
        ['classrooms', 'lastShare'],
        new Immutable.Map({status: 'ready', url: action.payload}),
      );

    case 'SHARE_TO_CLASSROOM_ERROR':
      return state.setIn(
        ['classrooms', 'lastShare'],
        new Immutable.Map({status: 'error', error: action.payload}),
      );
  }

  return state;
}
