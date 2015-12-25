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
