import Immutable from 'immutable';

const defaultState = new Immutable.Map({
  gists: new Immutable.Map({lastExport: null}),
});

export default function clients(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
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
  }

  return state;
}
