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
    case 'PROJECT_CREATED':
      return initialState;

    case 'CHANGE_CURRENT_PROJECT':
      return initialState;

    case 'REFRESH_PREVIEW': {
      if (state.isEmpty()) {
        return state;
      }

      const {source, title} = state.last();
      return trimRight(
        state.push(new CompiledProject({
          source,
          title,
          compiledProjectKey: action.payload.timestamp,
        })),
      );
    }

    case 'PROJECT_COMPILED':
      return trimRight(
        state.push(new CompiledProject({
          source: action.payload.source,
          title: action.payload.title,
          compiledProjectKey: action.meta.timestamp,
        })),
        2,
      );

    case 'USER_DONE_TYPING':
      return trimRight(state, 1);

    case 'VALIDATED_SOURCE':
      if (action.payload.errors.length) {
        return initialState;
      }
      return state;
  }

  return state;
}
