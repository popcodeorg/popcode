import {all, call, put, select, take, takeEvery} from 'redux-saga/effects';
import {debounceFor} from 'redux-saga-debounce-effect';
import {userDoneTyping as userDoneTypingAction} from '../actions/ui';
import {getCurrentProject} from '../selectors';
import {
  gistExportDisplayed,
  gistExportNotDisplayed,
  repoExportDisplayed,
  repoExportNotDisplayed,
} from '../actions/clients';
import {openWindowWithContent} from '../util';
import compileProject from '../util/compileProject';
import spinnerPageHtml from '../../templates/github-export.html';

export function* userDoneTyping() {
  yield put(userDoneTypingAction());
}

function* githubExport(
  successAction,
  failureAction,
  notDisplayedAction,
  displayedAction) {
  const exportWindow = yield call(openWindowWithContent, spinnerPageHtml);
  const {type, payload: url} =
    yield take([successAction, failureAction]);

  if (type === successAction) {
    if (exportWindow.closed) {
      yield put(notDisplayedAction(url));
    } else {
      exportWindow.location.href = url;
      yield put(displayedAction());
    }
  } else {
    yield call([exportWindow, 'close']);
  }
}

export function* exportGist() {
  yield* githubExport(
    'GIST_EXPORTED',
    'GIST_EXPORT_ERROR',
    gistExportNotDisplayed,
    gistExportDisplayed,
  );
}

export function* popOutProject() {
  const project = yield select(getCurrentProject);
  const {source} = yield call(compileProject, project);
  yield call(openWindowWithContent, source);
}

export function* exportRepo() {
  yield* githubExport(
    'REPO_EXPORTED',
    'REPO_EXPORT_ERROR',
    repoExportNotDisplayed,
    repoExportDisplayed,
  );
}

export default function* () {
  yield all([
    debounceFor('UPDATE_PROJECT_SOURCE', userDoneTyping, 1000),
    takeEvery('EXPORT_GIST', exportGist),
    takeEvery('POP_OUT_PROJECT', popOutProject),
    takeEvery('EXPORT_REPO', exportRepo),
  ]);
}
