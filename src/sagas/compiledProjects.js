import {
  all,
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';

import every from 'lodash/every';

import {getCurrentProject, getErrors} from '../selectors';
import generatePreview from '../util/generatePreview';
import {projectCompiled} from '../actions';

export function* validatedSource() {
  const errors = yield select(getErrors);
  if (every(errors, errorList => errorList.state === 'passed')) {
    const currentProject = yield select(getCurrentProject);
    const timestamp = Date.now();
    const preview = yield call(
      generatePreview,
      currentProject,
      {
        nonBlockingAlertsAndPrompts: true,
        targetBaseTop: true,
        propagateErrorsToParent: true,
        lastRefreshTimestamp: timestamp,
      },
    );
    yield put(projectCompiled(preview, timestamp));
  }
}

export default function* () {
  yield all([takeEvery('VALIDATED_SOURCE', validatedSource)]);
}
