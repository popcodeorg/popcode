import Immutable from 'immutable';

const defaultState = new Immutable.Map({
  gists: new Immutable.Map({exportInProgress: false}),
});

export default function clients(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'GIST_EXPORT_STARTED':
      return state.setIn(['gists', 'exportInProgress'], true);

    case 'GIST_EXPORT_COMPLETE':
      return state.setIn(['gists', 'exportInProgress'], false);

    case 'GIST_EXPORT_FAILED':
      return state.setIn(['gists', 'exportInProgress'], false);
  }

  return state;
}
