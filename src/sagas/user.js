import {all, call, put, takeEvery} from 'redux-saga/effects';
import isNull from 'lodash/isNull';
import {userAuthenticated} from '../actions/user';
import {getInitialUserState} from '../clients/firebaseAuth';

export function* applicationLoaded() {
  const userCredential = yield call(getInitialUserState);
  if (!isNull(userCredential)) {
    yield put(userAuthenticated(userCredential));
  }
}

export default function* () {
  yield all([
    takeEvery('APPLICATION_LOADED', applicationLoaded),
  ]);
}
