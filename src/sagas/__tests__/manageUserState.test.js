import {testSaga} from 'redux-saga-test-plan';
import {call, take} from 'redux-saga/effects';
import {channel} from 'redux-saga';

import {bugsnagClient} from '../../util/bugsnag';

import {credentialFactory, userFactory} from '@factories/clients/firebase';

import manageUserState, {
  handleAuthChange,
  handleAuthError,
  handleInitialAuth,
} from '../manageUserState';

import {
  getSessionUid,
  loadCredentialsForUser,
  saveUserCredential,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../../clients/firebase';

import {logIn, userAuthenticated, userLoggedOut} from '../../actions/user';

import {notificationTriggered} from '../../actions/ui';

function createUserCredential(providerId) {
  return {
    user: userFactory.build({providerId}),
    credential: credentialFactory.build({providerId}),
  };
}

class MockFirebaseError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const loginState = channel();

describe('manageUserState', () => {
  function testSagaInitialAuth() {
    const user = userFactory.build({providerId: 'google.com'});

    return testSaga(manageUserState, loginState)
      .next()
      .fork(startSessionHeartbeat)
      .next()
      .take(loginState)
      .next({user})
      .call(handleInitialAuth, user)
      .next()
      .race({
        logInAction: take('LOG_IN'),
        loginStateChange: take(loginState),
      });
  }

  test('successful explicit login', () => {
    const logInUserCredential = createUserCredential('google.com');
    testSagaInitialAuth()
      .next({logInAction: logIn('google.com')})
      .all([call(signIn, 'google.com'), take(loginState)])
      .next([logInUserCredential])
      .call(handleAuthChange, logInUserCredential.user, {
        newCredential: logInUserCredential.credential,
      });
  });

  test('failed explicit login', () => {
    const logInUserCredential = createUserCredential();
    testSagaInitialAuth()
      .next({logInAction: logIn('google.com')})
      .all([call(signIn, 'google.com'), take(loginState)])
      .next([logInUserCredential])
      .call(handleAuthChange, logInUserCredential.user, {
        newCredential: logInUserCredential.credential,
      });
  });

  test('implicit login', () => {
    const user = userFactory.build({providerId: 'google.com'});
    testSagaInitialAuth()
      .next({loginStateChange: {user}})
      .call(handleAuthChange, user);
  });

  test('implicit logout', () => {
    testSagaInitialAuth()
      .next({loginStateChange: {user: null}})
      .call(handleAuthChange, null);
  });
});

describe('handleInitialAuth', () => {
  test('with no logged in user', () => {
    testSaga(handleInitialAuth, null).next({user: null}).put(userLoggedOut());
  });

  test('with logged in user', () => {
    const {user, credential} = createUserCredential();
    testSaga(handleInitialAuth, user)
      .next()
      .call(getSessionUid)
      .next(user.uid)
      .call(loadCredentialsForUser, user.uid)
      .next([credential])
      .put(userAuthenticated(user, [credential]));
  });

  test('with expired session', () => {
    const user = userFactory.build({providerId: 'google.com'});
    testSaga(handleInitialAuth, user)
      .next()
      .call(getSessionUid)
      .next(undefined)
      .call(signOut);
  });
});

describe('handleAuthError', () => {
  test('popup closed by user', () => {
    testSaga(
      handleAuthError,
      new MockFirebaseError('auth/popup-closed-by-user'),
    )
      .next()
      .put(notificationTriggered('user-cancelled-auth'))
      .next()
      .isDone();
  });

  test('network request failed', () => {
    testSaga(
      handleAuthError,
      new MockFirebaseError('auth/network-request-failed'),
    )
      .next()
      .put(notificationTriggered('auth-network-error'))
      .next()
      .isDone();
  });

  test('cancelled popup request', () => {
    testSaga(
      handleAuthError,
      new MockFirebaseError('auth/cancelled-popup-request'),
    )
      .next()
      .isDone();
  });

  test('web storage unsupported', () => {
    testSaga(
      handleAuthError,
      new MockFirebaseError('auth/web-storage-unsupported'),
    )
      .next()
      .put(notificationTriggered('auth-third-party-cookies-disabled'))
      .next()
      .isDone();
  });

  test('operation not supported in this environment', () => {
    testSaga(
      handleAuthError,
      new MockFirebaseError('auth/operation-not-supported-in-this-environment'),
    )
      .next()
      .put(notificationTriggered('auth-third-party-cookies-disabled'))
      .next()
      .isDone();
  });

  test('internal error', () => {
    testSaga(handleAuthError, new MockFirebaseError('auth/internal-error'))
      .next()
      .put(notificationTriggered('auth-error'))
      .next()
      .isDone();
  });

  test('unrecognized error', () => {
    const e = new MockFirebaseError('auth/bogus-error');
    testSaga(handleAuthError, e)
      .next()
      .put(notificationTriggered('auth-error'))
      .next()
      .call([bugsnagClient, 'notify'], e, {
        metaData: {code: 'auth/bogus-error'},
      })
      .next()
      .isDone();
  });
});

describe('handleAuthChange', () => {
  const user = userFactory.build({providerId: 'google.com'});
  user.providerData.push({
    providerId: 'github.com',
    displayName: 'GitHub User',
    photoURL: 'https://github.com/popcodeuser.jpg',
  });

  const credentials = [
    credentialFactory.build({providerId: 'google.com'}),
    credentialFactory.build({providerId: 'github.com'}),
  ];

  test('with no new credential', () => {
    testSaga(handleAuthChange, user)
      .next()
      .call(loadCredentialsForUser, user.uid)
      .next(credentials)
      .put(userAuthenticated(user, credentials));
  });

  test('with new credential', () => {
    const newCredential = credentialFactory.build({
      providerId: 'google.com',
      accessToken: 'hhh',
    });

    testSaga(handleAuthChange, user, {newCredential})
      .next()
      .fork(saveUserCredential, {user, credential: newCredential})
      .next()
      .call(loadCredentialsForUser, user.uid)
      .next(credentials)
      .inspect(({payload: {action}}) => {
        expect(action).toEqual(
          userAuthenticated(user, [credentials[1], newCredential]),
        );
      });
  });

  test('log out', () => {
    testSaga(handleAuthChange, null).next().put(userLoggedOut());
  });
});
