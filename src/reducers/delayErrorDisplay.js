import isEmpty from 'lodash/isEmpty';

function delayErrorDisplay(stateIn, action) {
  let state = stateIn;
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

export default delayErrorDisplay;
