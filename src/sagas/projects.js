import {takeEvery, put, call} from 'redux-saga/effects';
import {projectCreated} from '../actions/projects';

export function* createProject() {
  const projectKey = yield call(generateProjectKey);
  yield put(projectCreated(projectKey));
}

function* watchCreateProject() {
  yield takeEvery('CREATE_PROJECT', createProject);
}

export function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

export default function* watchProjects() {
  yield [
    watchCreateProject(),
  ];
}
