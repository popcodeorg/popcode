var isEmpty = require('lodash/isEmpty');

function delayErrorDisplay(stateIn, action) {
  var state = stateIn;
  if (state === undefined) {
    state = false;
  }

  switch (action.type) {
    case 'VALIDATED_SOURCE':
      if (!isEmpty(action.payload.errors)) {
        return true;
      }
      return state;

    case 'ERROR_DEBOUNCE_FINISHED':
      return false;

    default:
      return state;
  }
}

module.exports = delayErrorDisplay;
