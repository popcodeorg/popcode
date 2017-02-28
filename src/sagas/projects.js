import {call, put, select, takeEvery} from 'redux-saga/effects';
import {projectCreated} from '../actions/projects';
import {saveCurrentProject} from '../util/projectUtils';

export function* createProject() {
  yield put(projectCreated(generateProjectKey()));
}

export function* changeCurrentProject() {
  const state = yield select();
  yield call(saveCurrentProject, state);
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

export default function* watchProjects() {
  yield [
    takeEvery('CREATE_PROJECT', createProject),
    takeEvery('CHANGE_CURRENT_PROJECT', changeCurrentProject),
  ];
}
