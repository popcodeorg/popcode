import {
  call,
  cancel,
  fork,
  join,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import Analyzer from '../analyzers';
import {getCurrentProject} from '../selectors';
import validations from '../validations';
import {validatedSource} from '../actions/errors';

export function* toggleLibrary(tasks) {
  yield call(validateCurrentProject, tasks);
}

export function* updateProjectSource(tasks, {payload: {language, newValue}}) {
  const state = yield select();
  const analyzer = new Analyzer(getCurrentProject(state));
  yield call(
    validateSource,
    tasks,
    {payload: {language, source: newValue, projectAttributes: analyzer}},
  );
}

export function* validateCurrentProject(tasks) {
  const state = yield select();
  const currentProject = getCurrentProject(state);
  const analyzer = new Analyzer(currentProject);

  for (const language of Reflect.ownKeys(currentProject.sources)) {
    const source = currentProject.sources[language];
    yield fork(
      validateSource,
      tasks,
      {payload: {language, source, projectAttributes: analyzer}},
    );
  }
}

export function* validateSource(
  tasks,
  {payload: {language, source, projectAttributes}},
) {
  if (tasks.has(language)) {
    yield cancel(tasks.get(language));
  }
  const task = yield fork(validations[language], source, projectAttributes);
  tasks.set(language, task);
  const errors = yield join(task);
  tasks.delete(language);
  yield put(validatedSource(language, errors));
}

export default function* () {
  const tasks = new Map();

  yield [
    takeEvery('CHANGE_CURRENT_PROJECT', validateCurrentProject, tasks),
    takeEvery('GIST_IMPORTED', validateCurrentProject, tasks),
    takeEvery('UPDATE_PROJECT_SOURCE', updateProjectSource, tasks),
    takeEvery('TOGGLE_LIBRARY', toggleLibrary, tasks),
  ];
}
