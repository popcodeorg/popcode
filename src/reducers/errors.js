import Immutable from 'immutable';

const emptyList = new Immutable.List();

const emptyErrors = new Immutable.Map({
  html: emptyList,
  css: emptyList,
  javascript: emptyList,
});

function errors(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = emptyErrors;
  }

  switch (action.type) {
    case 'CURRENT_PROJECT_LOADED_FROM_STORAGE':
      return emptyErrors;

    case 'CURRENT_PROJECT_CHANGED':
      return emptyErrors;

    case 'VALIDATING_SOURCE':
      return state.set(action.payload.language, emptyList);

    case 'VALIDATED_SOURCE':
      return state.set(
        action.payload.language,
        Immutable.fromJS(action.payload.errors)
      );

    case 'RESET_WORKSPACE':
      return emptyErrors;

    default:
      return state;
  }
}

export default errors;
