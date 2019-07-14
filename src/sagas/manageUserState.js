import {all, call, fork, put, race, take} from 'redux-saga/effects';
import difference from 'lodash-es/difference';
import isEmpty from 'lodash-es/isEmpty';
import isError from 'lodash-es/isError';
import isNil from 'lodash-es/isNil';
import isString from 'lodash-es/isString';
import map from 'lodash-es/map';
import reject from 'lodash-es/reject';

import {bugsnagClient} from '../util/bugsnag';
import {
  getSessionUid,
  loadCredentialsForUser,
  saveUserCredential,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../clients/firebase';
import {makeLoginState} from '../channels';
import {notificationTriggered} from '../actions/ui';
import {userAuthenticated, userLoggedOut} from '../actions/user';

export function* handleInitialAuth(user) {
  if (isNil(user)) {
    yield put(userLoggedOut());
    return;
  }

  const sessionUid = yield call(getSessionUid);
  if (user.uid !== sessionUid) {
    yield call(signOut);
    return;
  }

  const credentials = yield call(loadCredentialsForUser, user.uid);

  if (isEmpty(credentials)) {
    yield call(signOut);
    return;
  }

  yield* reportUserCredentialMismatch(user, credentials);

  yield put(userAuthenticated(user, credentials));
}

export function* handleAuthChange(user, {newCredential} = {}) {
  if (isNil(user)) {
    yield put(userLoggedOut());
    return;
  }

  if (!isNil(newCredential)) {
    yield fork(saveUserCredential, {user, credential: newCredential});
  }
  let credentials;

  const storedCredentials = yield call(loadCredentialsForUser, user.uid);
  if (isNil(newCredential)) {
    credentials = storedCredentials;
  } else {
    credentials = reject(storedCredentials, {
      providerId: newCredential.providerId,
    });
    credentials.push(newCredential);
  }

  yield* reportUserCredentialMismatch(user, credentials);

  yield put(userAuthenticated(user, credentials));
}
export function* handleAuthError(e) {
  if ('message' in e && e.message === 'popup_closed_by_user') {
    yield put(notificationTriggered('user-cancelled-auth'));
    return;
  }

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
      yield put(notificationTriggered('auth-third-party-cookies-disabled'));
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

function* reportUserCredentialMismatch(user, credentials) {
  const userProviders = map(user.providerData, 'providerId');
  const credentialProviders = map(credentials, 'providerId');

  const missingUserProviders = difference(userProviders, credentialProviders);
  const missingCredentialProviders = difference(
    credentialProviders,
    userProviders,
  );

  if (!isEmpty(missingUserProviders)) {
    const e = new Error(
      `User ${user.uid} has credentials for ` +
        `${missingUserProviders.join(',')} + but no linked account`,
    );
    yield call([bugsnagClient, 'notify'], e, {
      metaData: {user, credentials},
      severity: 'warning',
    });
  }

  if (!isEmpty(missingCredentialProviders)) {
    const e = new Error(
      `User ${user.uid} has linked accounts for ` +
        `${missingCredentialProviders.join(',')} + but no credentials`,
    );
    yield call([bugsnagClient, 'notify'], e, {
      metaData: {user, credentials},
      severity: 'warning',
    });
  }
}

export default function* manageUserState(loginState = makeLoginState()) {
  yield fork(startSessionHeartbeat);

  const {user: initialUser} = yield take(loginState);
  yield call(handleInitialAuth, initialUser);

  while (true) {
    const {loginStateChange, logInAction} = yield race({
      logInAction: take('LOG_IN'),
      loginStateChange: take(loginState),
    });

    if (isNil(logInAction)) {
      yield call(handleAuthChange, loginStateChange.user);
    } else {
      try {
        const [{user, credential}] = yield all([
          call(signIn, logInAction.payload.provider),
          take(loginState),
        ]);
        yield call(handleAuthChange, user, {newCredential: credential});
      } catch (e) {
        yield handleAuthError(e);
      }
    }
  }
}
