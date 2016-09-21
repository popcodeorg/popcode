import {createAction} from 'redux-actions';
import debounce from 'lodash/debounce';
import identity from 'lodash/identity';
import partial from 'lodash/partial';

export const TYPING_DEBOUNCE_DELAY = 1000;

const userIsTyping = createAction('USER_TYPING');

const userIsDoneTyping = createAction('USER_DONE_TYPING');

const userIsDoneTypingWithDebounce = partial(
  identity,
  debounce(
    (dispatch) => dispatch(userIsDoneTyping()),
    TYPING_DEBOUNCE_DELAY
  )
);

export function userTyped() {
  return (dispatch) => {
    dispatch(userIsTyping());
    dispatch(userIsDoneTypingWithDebounce());
  };
}

export const userRequestedFocusedLine = createAction(
  'USER_REQUESTED_FOCUSED_LINE',
  (language, line, column) => ({language, line, column})
);

export const editorFocusedRequestedLine = createAction(
  'EDITOR_FOCUSED_REQUESTED_LINE'
);

export const globalErrorTriggered = createAction(
  'GLOBAL_ERROR_TRIGGERED',
  (errorType) => ({errorType})
);

export const userDismissedGlobalError = createAction(
  'USER_DISMISSED_GLOBAL_ERROR',
  (errorType) => ({errorType})
);
