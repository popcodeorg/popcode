import Immutable from 'immutable';

const emptyMap = new Immutable.Map();

export default function reduceProjects(stateIn, action) {
  let state;

  if (stateIn === undefined) {
    state = emptyMap;
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'UPDATE_SELECTOR_LOCATIONS':
      return state.set('selectors', action.payload.selectors);

    default:
      return state;
  }
}
