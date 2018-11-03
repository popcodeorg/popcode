import Immutable from 'immutable';

import {SelectorLocations} from '../records';

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
      return state.set(
        'selectors',
        new SelectorLocations(action.payload.selectors),
      );

    default:
      return state;
  }
}
