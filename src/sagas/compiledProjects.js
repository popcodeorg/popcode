import {
  all,
  call,
  put,
  select,
  throttle,
  takeEvery,
} from 'redux-saga/effects';

import every from 'lodash-es/every';

import {getCurrentProject, getErrors} from '../selectors';
import compileProject from '../util/compileProject';
import {bugsnagClient} from '../util/bugsnag';
import {projectCompiled, projectCompilationFailed} from '../actions';

export function* validatedSource() {
  const errors = yield select(getErrors);
  if (every(errors, errorList => errorList.state === 'passed')) {
    const currentProject = yield select(getCurrentProject);
    const timestamp = Date.now();
    try {
      const preview = yield call(
        compileProject,
        currentProject,
        {isInlinePreview: true},
      );
      yield put(projectCompiled(preview, timestamp));
    } catch (e) {
      yield call([bugsnagClient, 'notify'], e);
      yield put(projectCompilationFailed(e));
    }
  }
}

export default function* () {
  yield all([
    throttle(100, 'VALIDATED_SOURCE', validatedSource),
    takeEvery('PROJECT_CREATED', validatedSource),
  ]);
}
