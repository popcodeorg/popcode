import {all, call, put, take, takeEvery} from 'redux-saga/effects';
import debounceFor from 'redux-saga-debounce-effect/src/debounceFor';
import {TextEncoder} from 'text-encoding';
import base64 from 'base64-js';
import {userDoneTyping as userDoneTypingAction} from '../actions/ui';
import {
  gistExportDisplayed,
  gistExportNotDisplayed,
  repoExportDisplayed,
  repoExportNotDisplayed} from '../actions/clients';
import {openWindowWithWorkaroundForChromeClosingBug} from '../util';
import generatePreview from '../util/generatePreview';
import {spinnerPage} from '../templates';

export function* userDoneTyping() {
  yield put(userDoneTypingAction());
}

export function* exportGist() {
  const exportWindow = yield call(
    openWindowWithWorkaroundForChromeClosingBug,
    `data:text/html;charset=utf-8;base64,${spinnerPage}`,
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

export function* popOutProject({payload: project}) {
  const preview = yield call(generatePreview, project);
  const uint8array = new TextEncoder('utf-8').encode(preview);
  const base64encoded = base64.fromByteArray(uint8array);
  const url = `data:text/html;charset=utf-8;base64,${base64encoded}`;
  yield call(openWindowWithWorkaroundForChromeClosingBug, url);
}

export function* exportRepo() {
  const exportWindow = yield call(
    openWindowWithWorkaroundForChromeClosingBug,
    `data:text/html;base64,${spinnerPage}`,
  );
  const {type, payload: url} =
    yield take(['REPO_EXPORTED', 'REPO_EXPORT_ERROR']);

  if (type === 'REPO_EXPORTED') {
    if (exportWindow.closed) {
      yield put(repoExportNotDisplayed(url));
    } else {
      exportWindow.location.href = url;
      yield put(repoExportDisplayed());
    }
  } else {
    yield call([exportWindow, 'close']);
  }
}

export default function* () {
  yield all([
    debounceFor('UPDATE_PROJECT_SOURCE', userDoneTyping, 1000),
    takeEvery('EXPORT_GIST', exportGist),
    takeEvery('POP_OUT_PROJECT', popOutProject),
    takeEvery('EXPORT_REPO', exportRepo),
  ];
}
