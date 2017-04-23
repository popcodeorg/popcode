import {put} from 'redux-saga/effects';
import debounceFor from 'redux-saga-debounce-effect/src/debounceFor';
import {userDoneTyping as userDoneTypingAction} from '../actions/ui';

export function* userDoneTyping() {
  yield put(userDoneTypingAction());
}

export default function* () {
  yield [
    debounceFor('UPDATE_PROJECT_SOURCE', userDoneTyping, 1000),
  ];
}
