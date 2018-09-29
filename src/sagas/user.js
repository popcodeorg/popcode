import {bugsnagClient} from '../util/bugsnag';
import isEmpty from 'lodash-es/isEmpty';
import isError from 'lodash-es/isError';
import isString from 'lodash-es/isString';
import {
  all,
  call,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import isNil from 'lodash-es/isNil';
import {notificationTriggered} from '../actions/ui';
import {
  accountMigrationComplete,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  identityLinked,
  linkIdentityFailed,
  userAuthenticated,
  userLoggedOut,
  accountMigrationError,
} from '../actions/user';
import {getCurrentAccountMigration} from '../selectors';
import loginState from '../channels/loginState';
import {
  getSessionUid,
  linkGithub,
  migrateAccount,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../clients/firebase';
import {getProfileForAuthenticatedUser} from '../clients/github';

export function* applicationLoaded() {
  yield call(startSessionHeartbeat);
  yield* handleInitialAuth();
  yield* handleAuthChange();
}

function* handleInitialAuth() {
  const {user: authUser, credentials} = yield take(loginState);

  if (isNil(authUser)) {
    yield put(userLoggedOut());
  } else {
    if (isEmpty(credentials)) {
      yield call(signOut);
      return;
    }

    const sessionUid = yield call(getSessionUid);
    if (authUser.uid !== sessionUid) {
      yield call(signOut);
      return;
    }

    yield put(userAuthenticated(authUser, credentials));
  }
}

function* handleAuthChange() {
  while (true) {
    const {user: authUser, credentials} = yield take(loginState);
    if (isNil(authUser)) {
      yield put(userLoggedOut());
    } else {
      yield put(userAuthenticated(authUser, credentials));
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
    switch (e.code) {
      case 'auth/credential-already-in-use': {
        const {data: githubProfile} = yield call(
          getProfileForAuthenticatedUser,
          e.credential.accessToken,
        );
        yield put(accountMigrationNeeded(githubProfile, e.credential));
        break;
      }

      default:
        yield call([bugsnagClient, 'notify'], e);
        yield put(linkIdentityFailed(e));
    }
  }
}

export function* startAccountMigration() {
  const {shouldContinue} = yield race({
    shouldContinue: call(delay, 5000, true),
    cancel: take('DISMISS_ACCOUNT_MIGRATION'),
  });

  if (!shouldContinue) {
    return;
  }

  yield put(accountMigrationUndoPeriodExpired());
  const {firebaseCredential} = yield select(getCurrentAccountMigration);
  try {
    const projects = yield call(migrateAccount, firebaseCredential);
    yield put(accountMigrationComplete(projects, firebaseCredential));
  } catch (e) {
    yield call([bugsnagClient, 'notify'], e);
    yield put(accountMigrationError(e));
  }
}

export function* logOut() {
  yield call(signOut);
}

export default function* user() {
  yield all([
    takeEvery('APPLICATION_LOADED', applicationLoaded),
    takeEvery('LINK_GITHUB_IDENTITY', linkGithubIdentity),
    takeEvery('LOG_IN', logIn),
    takeEvery('LOG_OUT', logOut),
    takeEvery('START_ACCOUNT_MIGRATION', startAccountMigration),
  ]);
}
