import {call, fork, put, select, takeEvery} from 'redux-saga/effects';
import Analyzer from '../analyzers';
import validations from '../validations';
import {validatedSource} from '../actions/errors';

export function* validateSource(language, source, projectAttributes) {
  const errors = yield call(validations[language], source, projectAttributes);
  yield put(validatedSource(language, errors));
}

export function* validateCurrentProject() {
  const state = yield select();
  const currentProject = state.getIn(
    ['projects', state.getIn(['currentProject', 'projectKey'])],
  );
  const analyzer = new Analyzer(currentProject);

  for (const [language, source] of currentProject.get('sources')) {
    yield fork(validateSource, language, source, analyzer);
  }
}

export default function* () {
  yield [
    takeEvery('CHANGE_CURRENT_PROJECT', validateCurrentProject),
    takeEvery('GIST_IMPORTED', validateCurrentProject),
  ];
}
