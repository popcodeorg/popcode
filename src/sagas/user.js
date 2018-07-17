import {bugsnagClient} from '../util/bugsnag';
import isEmpty from 'lodash-es/isEmpty';
import isError from 'lodash-es/isError';
import isString from 'lodash-es/isString';
import {all, call, put, take, takeEvery} from 'redux-saga/effects';
import isNil from 'lodash-es/isNil';
import {notificationTriggered} from '../actions/ui';
import {
  identityLinked,
  linkIdentityFailed,
  userAuthenticated,
  userLoggedOut,
} from '../actions/user';
import loginState from '../channels/loginState';
import {
  getSessionUid,
  linkGithub,
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
  const {user, credentials} = yield take(loginState);

  if (isNil(user)) {
    yield put(userLoggedOut());
  } else {
    if (isEmpty(credentials)) {
      yield call(signOut);
      return;
    }

    const sessionUid = yield call(getSessionUid);
    if (user.uid !== sessionUid) {
      yield call(signOut);
      return;
    }

    yield put(userAuthenticated(user, credentials));
  }
}

function* handleAuthChange() {
  while (true) {
    const {user, credentials} = yield take(loginState);
    if (isNil(user)) {
      yield put(userLoggedOut());
    } else {
      yield put(userAuthenticated(user, credentials));
    }
  }
}

export function* logIn({payload: {provider}}) {
  try {
    yield call(signIn, provider);
  } catch (e) {
    switch (e.code) {
      case 'popup-closed-by-user':
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

      case 'access_denied':
      case 'auth/internal-error':
        yield put(notificationTriggered('auth-error'));
        break;

      default:
        yield put(notificationTriggered('auth-error'));

        if (isError(e)) {
          yield call([bugsnagClient, 'notify'], e, {metaData: {code: e.code}});
        } else if (isString(e)) {
          yield call([bugsnagClient, 'notify'], new Error(e));
        }
        break;
    }
  }
}

export function* linkGithubIdentity() {
  try {
    const credential = yield call(linkGithub);
    yield put(identityLinked(credential));
  } catch (e) {
    yield put(linkIdentityFailed(e));
  }
}

export function* logOut() {
  yield call(signOut);
}

export default function* () {
  yield all([
    takeEvery('APPLICATION_LOADED', applicationLoaded),
    takeEvery('LINK_GITHUB_IDENTITY', linkGithubIdentity),
    takeEvery('LOG_IN', logIn),
    takeEvery('LOG_OUT', logOut),
  ]);
}
