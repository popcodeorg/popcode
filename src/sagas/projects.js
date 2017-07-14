import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  throttle,
} from 'redux-saga/effects';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import {
  gistImported,
  gistImportError,
  gistNotFound,
  projectCreated,
  projectLoaded,
} from '../actions/projects';
import {saveCurrentProject} from '../util/projectUtils';
import {loadGistFromId} from '../clients/github';
import {loadAllProjects} from '../clients/firebase';
import {getCurrentUserId} from '../selectors';

export function* applicationLoaded(action) {
  if (isNull(action.payload.gistId)) {
    yield call(createProject);
  } else {
    yield call(importGist, action);
  }
}

export function* createProject() {
  yield put(projectCreated(generateProjectKey()));
}

export function* changeCurrentProject() {
  const state = yield select();

  yield call(saveCurrentProject, state);
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

  for (const project of projects) {
    yield put(projectLoaded(project));
  }
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
    throttle(500, 'UPDATE_PROJECT_SOURCE', updateProjectSource),
    takeEvery('USER_AUTHENTICATED', userAuthenticated),
    takeEvery('TOGGLE_LIBRARY', toggleLibrary),
  ]);
}
