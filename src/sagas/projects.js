import {call, put, select, takeEvery} from 'redux-saga/effects';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import {
  gistImported,
  gistImportError,
  gistNotFound,
  projectCreated,
} from '../actions/projects';
import {saveCurrentProject} from '../util/projectUtils';
import Gists from '../services/Gists';

export function* applicationLoaded({gistId}) {
  if (isNull(gistId)) {
    yield call(createProject);
  } else {
    yield call(importGist, gistId);
  }
}

export function* createProject() {
  yield put(projectCreated(generateProjectKey()));
}

export function* changeCurrentProject() {
  const state = yield select();

  yield call(saveCurrentProject, state);
}

export function* importGist(gistId) {
  try {
    const gistData =
      yield call(Gists.loadFromId, gistId, {authenticated: false});
    yield put(gistImported(generateProjectKey(), gistData));
  } catch (error) {
    if (get(error, 'response.status') === 404) {
      yield put(gistNotFound(gistId));
    } else {
      yield put(gistImportError());
    }
  }
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

export default function* () {
  yield [
    takeEvery('APPLICATION_LOADED', applicationLoaded),
    takeEvery('CREATE_PROJECT', createProject),
    takeEvery('CHANGE_CURRENT_PROJECT', changeCurrentProject),
  ];
}
