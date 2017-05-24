import {call, put, take, takeEvery} from 'redux-saga/effects';
import debounceFor from 'redux-saga-debounce-effect/src/debounceFor';
import {userDoneTyping as userDoneTypingAction} from '../actions/ui';
import {gistExportDisplayed, gistExportNotDisplayed} from '../actions/clients';
import {openWindowWithWorkaroundForChromeClosingBug} from '../util';
import {spinnerPage} from '../templates';

export function* userDoneTyping() {
  yield put(userDoneTypingAction());
}

export function* exportGist() {
  const exportWindow = yield call(
    openWindowWithWorkaroundForChromeClosingBug,
    `data:text/html;base64,${spinnerPage}`,
  );
  const {type, payload: url} =
    yield take(['GIST_EXPORTED', 'GIST_EXPORT_ERROR']);

  if (type === 'GIST_EXPORTED') {
    if (exportWindow.closed) {
      yield put(gistExportNotDisplayed(url));
    } else {
      exportWindow.location.href = url;
      yield put(gistExportDisplayed());
    }
  } else {
    yield call([exportWindow, 'close']);
  }
}

export default function* () {
  yield [
    debounceFor('UPDATE_PROJECT_SOURCE', userDoneTyping, 1000),
    takeEvery('EXPORT_GIST', exportGist),
  ];
}
