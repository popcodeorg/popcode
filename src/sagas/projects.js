import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  throttle,
  takeLatest,
} from 'redux-saga/effects';
import isNull from 'lodash-es/isNull';
import isString from 'lodash-es/isString';
import get from 'lodash-es/get';
import reduce from 'lodash-es/reduce';

import {
  gistImported,
  gistImportError,
  gistNotFound,
  projectCreated,
  projectsLoaded,
  projectSuccessfullySaved,
  projectBeautified,
} from '../actions/projects';
import {
  snapshotImported,
  snapshotImportError,
  snapshotNotFound,
  projectRestoredFromLastSession,
} from '../actions/clients';
import {isPristineProject} from '../util/projectUtils';
import {loadGistFromId} from '../clients/github';
import {
  loadAllProjects,
  loadProjectSnapshot,
  saveProject,
} from '../clients/firebase';
import beautifySource from '../util/beautifySource';
import {getCurrentProject, getProject, getCurrentUserId} from '../selectors';

export function* applicationLoaded(action) {
  if (isString(action.payload.gistId)) {
    yield call(importGist, action);
  } else if (isString(action.payload.snapshotKey)) {
    yield call(importSnapshot, action);
  } else if (action.payload.rehydratedProject) {
    yield put(projectRestoredFromLastSession(action.payload.rehydratedProject));
  } else {
    yield call(createProject);
  }
}

export function* createProject() {
  yield put(projectCreated(generateProjectKey()));
}

export function* changeCurrentProject() {
  yield* saveCurrentProject();
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
    const gistData = yield call(loadGistFromId, gistId);
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
  yield* saveCurrentProject();
}

export function* loadAndBeautifyProjectSource() {
  const currentProject = yield select(getCurrentProject);
  const sourcesMap = yield all(
    reduce(
      currentProject.sources,
      (calls, source, language) =>
        Object.assign(calls, {
          [language]: call(beautifySource, source, language),
        }),
      {},
    ),
  );
  yield put(projectBeautified(currentProject.projectKey, sourcesMap));
}

export function* userAuthenticated() {
  const state = yield select();
  yield fork(saveCurrentProject);

  const allProjects = yield call(loadAllProjects, getCurrentUserId(state));

  yield put(projectsLoaded(allProjects));
}

export function* toggleLibrary() {
  yield* saveCurrentProject();
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

export function* projectExported({payload: {exportType}}) {
  if (exportType === 'repo') {
    yield* saveCurrentProject();
  }
}

export function* saveCurrentProject() {
  const currentProject = yield select(getCurrentProject);
  if (currentProject) {
    yield* saveProjectWithKey(currentProject.projectKey);
  }
}

function* saveProjectWithKey(projectKey) {
  const state = yield select();
  const userId = yield call(getCurrentUserId, state);
  const project = yield call(getProject, state, {projectKey});
  if (userId && !isPristineProject(project)) {
    yield call(saveProject, userId, project);
    yield put(projectSuccessfullySaved());
  }
}

export function* archiveProject({payload: {projectKey}}) {
  yield* saveProjectWithKey(projectKey);
}

export function* unArchiveProject({payload: {projectKey}}) {
  yield* saveProjectWithKey(projectKey);
}

export default function* projects() {
  yield all([
    takeEvery('APPLICATION_LOADED', applicationLoaded),
    takeEvery('CREATE_PROJECT', createProject),
    takeEvery('CHANGE_CURRENT_PROJECT', changeCurrentProject),
    takeEvery('PROJECT_EXPORTED', projectExported),
    throttle(
      500,
      ['UPDATE_PROJECT_SOURCE', 'UPDATE_PROJECT_INSTRUCTIONS'],
      updateProjectSource,
    ),
    takeEvery('USER_AUTHENTICATED', userAuthenticated),
    takeEvery('TOGGLE_LIBRARY', toggleLibrary),
    takeLatest('BEAUTIFY_PROJECT_SOURCE', loadAndBeautifyProjectSource),
    takeEvery('ARCHIVE_PROJECT', archiveProject),
  ]);
}
