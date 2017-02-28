import {takeEvery, put} from 'redux-saga/effects';
import {projectCreated} from '../actions/projects';

export function* createProject() {
  yield put(projectCreated(generateProjectKey()));
}

function* watchCreateProject() {
  yield takeEvery('CREATE_PROJECT', createProject);
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

export default function* watchProjects() {
  yield [
    watchCreateProject(),
  ];
}
