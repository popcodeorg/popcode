import Immutable from 'immutable';

const emptyList = new Immutable.List();

const passedLanguageErrors = new Immutable.Map({
  items: emptyList,
  state: 'passed',
});

const validatingLanguageErrors = new Immutable.Map({
  items: emptyList,
  state: 'validating',
});

function buildFailedLanguageErrors(errorList) {
  return Immutable.fromJS({
    items: errorList,
    state: 'validation-error',
  });
}

const validatingErrors = new Immutable.Map({
  html: validatingLanguageErrors,
  css: validatingLanguageErrors,
  javascript: validatingLanguageErrors,
});

const emptyErrors = new Immutable.Map({
  html: passedLanguageErrors,
  css: passedLanguageErrors,
  javascript: passedLanguageErrors,
});

function errors(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = emptyErrors;
  }

  switch (action.type) {
    case 'PROJECT_CREATED':
      return emptyErrors;

    case 'CHANGE_CURRENT_PROJECT':
      return validatingErrors;

    case 'GIST_IMPORTED':
      return validatingErrors;

    case 'TOGGLE_LIBRARY':
      return validatingErrors;

    case 'UPDATE_PROJECT_SOURCE':
      return state.set(action.payload.language, validatingLanguageErrors);

    case 'ADD_RUNTIME_ERROR':
      return state.update(
        action.payload.language,
        list => list.update(
          'items',
          items => items.push(Immutable.fromJS(action.payload.error)).
            sortBy(error => error.get('row')),
        ).set('state', 'runtime-error'));

    case 'VALIDATED_SOURCE':
      if (action.payload.errors.length) {
        return state.set(
          action.payload.language,
          buildFailedLanguageErrors(action.payload.errors),
        );
      }
      return state.set(action.payload.language, passedLanguageErrors);

    default:
      return state;
  }
}

export default errors;
