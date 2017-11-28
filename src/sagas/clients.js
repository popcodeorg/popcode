import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {
  createGistFromProject,
  createRepoFromProject,
} from '../clients/github';
import {
  createShareToClassroomUrl,
} from '../clients/googleClassroom';
import {createProjectSnapshot} from '../clients/firebase';
import {
  snapshotCreated,
  snapshotExportError,
  projectExported,
  projectExportError,
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

export function* exportProject({payload}) {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  const {exportType} = payload;

  try {
    if (exportType === 'gist') {
      const {html_url: url} = yield call(createGistFromProject, project, user);
      yield put(projectExported(url, exportType));
    } else if (exportType === 'repo') {
      const {html_url: url} = yield call(createRepoFromProject, project, user);
      yield put(projectExported(url, exportType));
    } else if (exportType === 'classroom') {
      const snapshotKey = yield call(createProjectSnapshot, project);
      const url = yield call(createShareToClassroomUrl, snapshotKey);
      yield put(projectExported(url, exportType));
    }
  } catch (e) {
    yield put(projectExportError(exportType));
  }
}

export default function* () {
  yield all([
    takeEvery('CREATE_SNAPSHOT', createSnapshot),
    takeEvery('EXPORT_PROJECT', exportProject),
  ]);
}
