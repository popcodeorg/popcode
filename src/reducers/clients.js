import Immutable from 'immutable';

const defaultState = new Immutable.Map({
  firebase: new Immutable.Map({exportingSnapshot: false}),
  projectExports: new Immutable.Map(),
  courses: new Immutable.List(),
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

    case 'EXPORT_PROJECT':
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'waiting'}),
      );

    case 'PROJECT_EXPORTED':
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'ready', url: action.payload.url}),
      );

    case 'PROJECT_EXPORT_ERROR':
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'error'}),
      );

    case 'UPDATE_COURSES':
      return state.setIn(
        ['courses'],
        new Immutable.List(action.payload.courses),
      );
  }

  return state;
}
