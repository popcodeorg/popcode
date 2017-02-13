import Immutable from 'immutable';

const emptyList = new Immutable.List();

function runtimeErrors(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = emptyList;
  }

  switch (action.type) {
    case 'RUNTIME_ERROR_ADDED':
      return state.push(Immutable.fromJS(action.payload.error)).
        sortBy(error => error.get('row'));

    case 'RUNTIME_ERRORS_CLEARED':
      return emptyList;

    default:
      return state;
  }
}

export default runtimeErrors;
