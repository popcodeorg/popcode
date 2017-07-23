import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {
  createGistFromProject,
  createRepoFromProject,
} from '../clients/github';
import {createProjectSnapshot} from '../clients/firebase';
import {
  snapshotCreated,
  snapshotExportError,
  gistExported,
  gistExportError,
  repoExported,
  repoExportError,
} from '../actions/clients';
import {getCurrentProject} from '../selectors';

export function* createSnapshot() {
  const project = yield select(getCurrentProject);
  try {
    const snapshotKey = yield call(createProjectSnapshot, project);
    yield put(snapshotCreated(snapshotKey));
  } catch (e) {
    yield put(snapshotExportError(e));
  }
}

export function* exportGist() {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  try {
    const {html_url} = yield call(createGistFromProject, project, user);
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
    takeEvery('CREATE_SNAPSHOT', createSnapshot),
  ]);
}
