// import {confirmIdentity} from '../actions/user';
import Bugsnag from '../util/Bugsnag';
import config from '../config';
import isError from 'lodash/isError';
import isString from 'lodash/isString';
import {all, call, put, take, takeEvery} from 'redux-saga/effects';
import isNil from 'lodash/isNil';
import {notificationTriggered} from '../actions/ui';
import {userAuthenticated, userLoggedOut} from '../actions/user';
import loginState from '../channels/loginState';
import {
  getSessionUid,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../clients/firebase';

export function* applicationLoaded() {
  yield call(startSessionHeartbeat);
  yield* handleInitialAuth();
  yield* handleAuthChange();
}

function* handleInitialAuth() {
  const {userCredential} = yield take(loginState);
  if (isNil(userCredential)) {
    yield put(userLoggedOut());
  } else {
    if (isNil(userCredential.credential)) {
      yield call(signOut);
      return;
    }

    const sessionUid = yield call(getSessionUid);
    if (userCredential.user.uid !== sessionUid) {
      yield call(signOut);
      return;
    }

    // yield put(confirmIdentity(userCredential));
    yield put(userAuthenticated(userCredential));
  }
}

function* handleAuthChange() {
  while (true) {
    const {userCredential} = yield take(loginState);
    if (isNil(userCredential)) {
      yield put(userLoggedOut());
    } else {
      yield put(userAuthenticated(userCredential));
    }
  }
}

export function* logIn() {
  try {
    yield call(signIn);
  } catch (e) {
    switch (e.code) {
      case 'auth/popup-closed-by-user':
        yield put(notificationTriggered('user-cancelled-auth'));
        break;

      case 'auth/network-request-failed':
        yield put(notificationTriggered('auth-network-error'));
        break;

      case 'auth/cancelled-popup-request':
        break;

      case 'auth/web-storage-unsupported':
      case 'auth/operation-not-supported-in-this-environment':
        yield put(
          notificationTriggered('auth-third-party-cookies-disabled'),
        );
        break;

      case 'auth/internal-error':
        yield put(notificationTriggered('auth-error'));
        break;

      default:
        yield put(notificationTriggered('auth-error'));

        if (isError(e)) {
          yield call([Bugsnag, 'notifyException'], e, e.code);
        } else if (isString(e)) {
          yield call([Bugsnag, 'notifyException'], new Error(e));
        }
        break;
    }
  }
}

export function* logOut() {
  yield call(signOut);
}

export function* rejectIdentity() {
  window.open(config.gitHubLogoutUrl, '_blank');
  yield signOut();
}

export default function* () {
  yield all([
    takeEvery('APPLICATION_LOADED', applicationLoaded),
    takeEvery('LOG_IN', logIn),
    takeEvery('LOG_OUT', logOut),
    takeEvery('REJECT_IDENTITY', rejectIdentity),
  ]);
}
