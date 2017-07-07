import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {createFromProject} from '../clients/gists';
import {createRepoFromProject} from '../clients/repos';
import {
  gistExported,
  gistExportError,
  repoExported,
  repoExportError,
  } from '../actions/clients';
import {getCurrentProject} from '../selectors/';

export function* exportGist() {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  try {
    const {html_url} = yield call(createFromProject, project, user);
    yield put(gistExported(html_url));
  } catch (e) {
    yield put(gistExportError(e));
  }
}

export function* exportRepo() {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  try {
    const {html_url} = yield call(createRepoFromProject, project, user);
    yield put(repoExported(html_url));
  } catch (e) {
    yield put(repoExportError(e));
  }
}

export default function* () {
  yield all([
    takeEvery('EXPORT_GIST', exportGist),
    takeEvery('EXPORT_REPO', exportRepo),
  ]);
}
