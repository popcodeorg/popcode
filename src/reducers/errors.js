import {List} from 'immutable';
import map from 'lodash-es/map';

import {Error, ErrorList, ErrorReport} from '../records';

const passedLanguageErrors = new ErrorList();

const validatingLanguageErrors = new ErrorList({state: 'validating'});

function buildFailedLanguageErrors(errorList) {
  return new ErrorList({
    items: new List(map(errorList, error => Error.fromJS(error))),
    state: 'validation-error',
  });
}

const validatingErrors = new ErrorReport({
  html: validatingLanguageErrors,
  css: validatingLanguageErrors,
  javascript: validatingLanguageErrors,
});

const emptyErrors = new ErrorReport({
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

    case 'SNAPSHOT_IMPORTED':
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
          items => items.push(Error.fromJS(action.payload.error)).
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

    case 'REFRESH_PREVIEW':
      return state.update(
        'javascript',
        (errorList) => {
          if (errorList.state === 'runtime-error') {
            return passedLanguageErrors;
          }
          return errorList;
        },
      );

    default:
      return state;
  }
}

export default errors;
