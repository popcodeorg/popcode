import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  throttle,
} from 'redux-saga/effects';
import isNull from 'lodash-es/isNull';
import isString from 'lodash-es/isString';
import get from 'lodash-es/get';
import {
  gistImported,
  gistImportError,
  gistNotFound,
  projectCreated,
  projectsLoaded,
} from '../actions/projects';
import {
  snapshotImported,
  snapshotImportError,
  snapshotNotFound,
  projectRestoredFromLastSession,
} from '../actions/clients';
import {saveCurrentProject} from '../util/projectUtils';
import {loadGistFromId} from '../clients/github';
import {loadAllProjects, loadProjectSnapshot} from '../clients/firebase';
import {getCurrentUserId} from '../selectors';

export function* applicationLoaded(action) {
  if (isString(action.payload.gistId)) {
    yield call(importGist, action);
  } else if (isString(action.payload.snapshotKey)) {
    yield call(importSnapshot, action);
  } else if (action.payload.rehydratedProject) {
    yield put(
      projectRestoredFromLastSession(action.payload.rehydratedProject),
    );
  } else {
    yield call(createProject);
  }
}

export function* createProject() {
  yield put(projectCreated(generateProjectKey()));
}

export function* changeCurrentProject() {
  const state = yield select();

  yield call(saveCurrentProject, state);
}

export function* importSnapshot({payload: {snapshotKey}}) {
  try {
    const snapshot = yield call(loadProjectSnapshot, snapshotKey);
    if (isNull(snapshot)) {
      yield put(snapshotNotFound());
    } else {
      const projectKey = generateProjectKey();
      yield put(snapshotImported(projectKey, snapshot));
    }
  } catch (error) {
    yield put(snapshotImportError(error));
  }
}

export function* importGist({payload: {gistId}}) {
  try {
    const gistData =
      yield call(loadGistFromId, gistId, {authenticated: false});
    yield put(gistImported(generateProjectKey(), gistData));
  } catch (error) {
    if (get(error, 'response.status') === 404) {
      yield put(gistNotFound(gistId));
    } else {
      yield put(gistImportError());
    }
  }
}

export function* updateProjectSource() {
  const state = yield select();
  yield call(saveCurrentProject, state);
}

export function* userAuthenticated() {
  const state = yield select();
  yield fork(saveCurrentProject, state);

  const projects = yield call(loadAllProjects, getCurrentUserId(state));

  yield put(projectsLoaded(projects));
}

export function* toggleLibrary() {
  const state = yield select();

  yield call(saveCurrentProject, state);
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

export default function* () {
  yield all([
    takeEvery('APPLICATION_LOADED', applicationLoaded),
    takeEvery('CREATE_PROJECT', createProject),
    takeEvery('CHANGE_CURRENT_PROJECT', changeCurrentProject),
    throttle(500, [
      'UPDATE_PROJECT_SOURCE',
      'UPDATE_PROJECT_INSTRUCTIONS',
    ], updateProjectSource),
    takeEvery('USER_AUTHENTICATED', userAuthenticated),
    takeEvery('TOGGLE_LIBRARY', toggleLibrary),
  ]);
}
