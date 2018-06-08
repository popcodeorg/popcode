import {delay} from 'redux-saga';
import {all, call, put, select, take, takeEvery} from 'redux-saga/effects';
import {debounceFor} from 'redux-saga-debounce-effect';
import {
  userDoneTyping as userDoneTypingAction,
  showSaveIndicator,
  hideSaveIndicator,
} from '../actions/ui';
import {getCurrentProject} from '../selectors';
import {
  projectExportDisplayed,
  projectExportNotDisplayed,
} from '../actions/clients';
import {openWindowWithContent} from '../util';
import spinnerPageHtml from '../../templates/project-export.html';
import compileProject from '../util/compileProject';

export function* userDoneTyping() {
  yield put(userDoneTypingAction());
}

export function* projectSuccessfullySaved() {
  yield put(showSaveIndicator());
  yield call(delay, 1000);
  yield put(hideSaveIndicator());
}

function* projectExport(
  successAction,
  failureAction,
  notDisplayedAction,
  displayedAction) {
  const exportWindow =
    yield call(openWindowWithContent, spinnerPageHtml);
  const {type, payload: {url, exportType}} =
    yield take([successAction, failureAction]);
  if (type === successAction) {
    if (exportWindow.closed) {
      yield put(notDisplayedAction(url, exportType));
    } else {
      exportWindow.location.href = url;
      yield put(displayedAction());
    }
  } else {
    yield call([exportWindow, 'close']);
  }
}

export function* popOutProject() {
  const project = yield select(getCurrentProject);
  const {source} = yield call(compileProject, project);
  yield call(openWindowWithContent, source);
}

export function* exportProject() {
  yield* projectExport(
    'PROJECT_EXPORTED',
    'PROJECT_EXPORT_ERROR',
    projectExportNotDisplayed,
    projectExportDisplayed,
  );
}

export default function* () {
  yield all([
    debounceFor('UPDATE_PROJECT_SOURCE', userDoneTyping, 1000),
    takeEvery('POP_OUT_PROJECT', popOutProject),
    takeEvery('EXPORT_PROJECT', exportProject),
    debounceFor('PROJECT_SUCCESSFULLY_SAVED', projectSuccessfullySaved, 1000),
  ]);
}
