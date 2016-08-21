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
