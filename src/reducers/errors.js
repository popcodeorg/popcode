var Immutable = require('immutable');

var emptyList = new Immutable.List();

var emptyErrors = new Immutable.Map({
  html: emptyList,
  css: emptyList,
  javascript: emptyList,
});

function errors(stateIn, action) {
  var state = stateIn;
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

    default:
      return state;
  }
}

module.exports = errors;
