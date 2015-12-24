var Immutable = require('immutable');

function errors(stateIn, action) {
  var state = stateIn;
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case 'VALIDATING_SOURCE':
      return state.delete(action.language);

    case 'VALIDATED_SOURCE':
      return state.set(action.language, Immutable.fromJS(action.errors));

    default:
      return state;
  }
}

module.exports = errors;
