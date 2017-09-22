import {List} from 'immutable';
import {CompiledProject} from '../records';

const initialState = new List();

function trimRight(list, maxLength) {
  if (list.size <= maxLength) {
    return list;
  }

  return list.splice(0, list.size - maxLength);
}

export default function compiledProjects(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = initialState;
  }

  switch (action.type) {
    case 'PROJECT_COMPILED':
      return trimRight(
        state.push(new CompiledProject({
          source: action.payload.source,
          title: action.payload.title,
          timestamp: action.meta.timestamp,
        })),
        2,
      );
  }

  return state;
}
