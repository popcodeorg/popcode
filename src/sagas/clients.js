import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {
  createGistFromProject,
  createOrUpdateRepoFromProject,
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
  gapiClientReady,
} from '../actions/clients';
import {getCurrentProject} from '../selectors';
import {generateTextPreview} from '../util/compileProject';
import {loadAndConfigureGapi} from '../services/gapi';


export function* createSnapshot() {
  const project = yield select(getCurrentProject);
  try {
    const snapshotKey = yield call(createProjectSnapshot, project);
    yield put(snapshotCreated(snapshotKey));
  } catch (e) {
    yield put(snapshotExportError(e));
  }
}

export function* exportProject({payload: {exportType}}) {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  let exportData = {};
  let url, name;

  try {
    if (exportType === 'gist') {
      ({html_url: url} = yield call(createGistFromProject, project, user));
    } else if (exportType === 'repo') {
      ({url, name} = yield call(createOrUpdateRepoFromProject, project, user));
      if (name) {
        exportData = {name};
      }
    } else if (exportType === 'classroom') {
      const snapshotKey = yield call(createProjectSnapshot, project);
      const projectTitle = yield call(generateTextPreview, project);
      url = yield call(createShareToClassroomUrl, snapshotKey, projectTitle);
    }
    yield put(projectExported(
      url,
      exportType,
      project.projectKey,
      exportData,
    ));
  } catch (e) {
    yield put(projectExportError(exportType));
  }
}

export function* applicationLoaded() {
  yield loadAndConfigureGapi();
  yield put(gapiClientReady());
}

export default function* () {
  yield all([
    takeEvery('CREATE_SNAPSHOT', createSnapshot),
    takeEvery('EXPORT_PROJECT', exportProject),
    takeEvery('APPLICATION_LOADED', applicationLoaded),
  ]);
}
