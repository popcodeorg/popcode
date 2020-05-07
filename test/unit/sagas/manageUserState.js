import test from 'tape-catch';
import {testSaga} from 'redux-saga-test-plan';
import {call, take} from 'redux-saga/effects';
import {channel} from 'redux-saga';

import {bugsnagClient} from '../../../src/util/bugsnag';

import {
  credential as createCredential,
  user as createUser,
  userCredential as createUserCredential,
} from '../../helpers/factory';

import manageUserState, {
  handleAuthChange,
  handleAuthError,
  handleInitialAuth,
} from '../../../src/sagas/manageUserState';

import {
  getSessionUid,
  loadCredentialsForUser,
  saveUserCredential,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../../../src/clients/firebase';

import {
  logIn,
  userAuthenticated,
  userLoggedOut,
} from '../../../src/actions/user';

import {notificationTriggered} from '../../../src/actions/ui';

const provider = 'google.com';

class MockFirebaseError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const loginState = channel();

test('manageUserState', t => {
  function testSagaInitialAuth() {
    const user = createUser();

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

  t.test('successful explicit login', assert => {
    const logInUserCredential = createUserCredential();
    assert.doesNotThrow(() => {
      testSagaInitialAuth()
        .next({logInAction: logIn(provider)})
        .all([call(signIn, provider), take(loginState)])
        .next([logInUserCredential])
        .call(handleAuthChange, logInUserCredential.user, {
          newCredential: logInUserCredential.credential,
        });
    });

    assert.end();
  });

  t.test('failed explicit login', assert => {
    const logInUserCredential = createUserCredential();
    assert.doesNotThrow(() => {
      testSagaInitialAuth()
        .next({logInAction: logIn(provider)})
        .all([call(signIn, provider), take(loginState)])
        .next([logInUserCredential])
        .call(handleAuthChange, logInUserCredential.user, {
          newCredential: logInUserCredential.credential,
        });
    });

    assert.end();
  });

  t.test('implicit login', assert => {
    const user = createUser();
    assert.doesNotThrow(() => {
      testSagaInitialAuth()
        .next({loginStateChange: {user}})
        .call(handleAuthChange, user);
    });

    assert.end();
  });

  t.test('implicit logout', assert => {
    assert.doesNotThrow(() => {
      testSagaInitialAuth()
        .next({loginStateChange: {user: null}})
        .call(handleAuthChange, null);
    });

    assert.end();
  });

  t.end();
});

test('handleInitialAuth', t => {
  t.test('with no logged in user', assert => {
    assert.doesNotThrow(() => {
      testSaga(handleInitialAuth, null).next({user: null}).put(userLoggedOut());
    });

    assert.end();
  });

  t.test('with logged in user', assert => {
    const {user, credential} = createUserCredential();
    assert.doesNotThrow(() => {
      testSaga(handleInitialAuth, user)
        .next()
        .call(getSessionUid)
        .next(user.uid)
        .call(loadCredentialsForUser, user.uid)
        .next([credential])
        .put(userAuthenticated(user, [credential]));
    });

    assert.end();
  });

  t.test('with expired session', assert => {
    const user = createUser();
    assert.doesNotThrow(() => {
      testSaga(handleInitialAuth, user)
        .next()
        .call(getSessionUid)
        .next(undefined)
        .call(signOut);
    });

    assert.end();
  });
});

test('handleAuthError', t => {
  t.test('popup closed by user', assert => {
    assert.doesNotThrow(() => {
      testSaga(
        handleAuthError,
        new MockFirebaseError('auth/popup-closed-by-user'),
      )
        .next()
        .put(notificationTriggered('user-cancelled-auth'))
        .next()
        .isDone();
    });

    assert.end();
  });

  t.test('network request failed', assert => {
    assert.doesNotThrow(() => {
      testSaga(
        handleAuthError,
        new MockFirebaseError('auth/network-request-failed'),
      )
        .next()
        .put(notificationTriggered('auth-network-error'))
        .next()
        .isDone();
    });

    assert.end();
  });

  t.test('cancelled popup request', assert => {
    assert.doesNotThrow(() => {
      testSaga(
        handleAuthError,
        new MockFirebaseError('auth/cancelled-popup-request'),
      )
        .next()
        .isDone();

      assert.end();
    });
  });

  t.test('web storage unsupported', assert => {
    assert.doesNotThrow(() => {
      testSaga(
        handleAuthError,
        new MockFirebaseError('auth/web-storage-unsupported'),
      )
        .next()
        .put(notificationTriggered('auth-third-party-cookies-disabled'))
        .next()
        .isDone();
    });

    assert.end();
  });

  t.test('operation not supported in this environment', assert => {
    assert.doesNotThrow(() => {
      testSaga(
        handleAuthError,
        new MockFirebaseError(
          'auth/operation-not-supported-in-this-environment',
        ),
      )
        .next()
        .put(notificationTriggered('auth-third-party-cookies-disabled'))
        .next()
        .isDone();
    });

    assert.end();
  });

  t.test('internal error', assert => {
    assert.doesNotThrow(() => {
      testSaga(handleAuthError, new MockFirebaseError('auth/internal-error'))
        .next()
        .put(notificationTriggered('auth-error'))
        .next()
        .isDone();
    });

    assert.end();
  });

  t.test('unrecognized error', assert => {
    const e = new MockFirebaseError('auth/bogus-error');
    assert.doesNotThrow(() => {
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

    assert.end();
  });
});

test('handleAuthChange', t => {
  const user = createUser();
  user.providerData.push({
    providerId: 'github.com',
    displayName: 'GitHub User',
    photoURL: 'https://github.com/popcodeuser.jpg',
  });

  const credentials = [
    createCredential({providerId: 'google.com'}),
    createCredential({providerId: 'github.com'}),
  ];

  t.test('with no new credential', assert => {
    assert.doesNotThrow(() => {
      testSaga(handleAuthChange, user)
        .next()
        .call(loadCredentialsForUser, user.uid)
        .next(credentials)
        .put(userAuthenticated(user, credentials));
    });
    assert.end();
  });

  t.test('with new credential', assert => {
    const newCredential = createCredential({
      providerId: 'google.com',
      accessToken: 'hhh',
    });

    assert.doesNotThrow(() => {
      testSaga(handleAuthChange, user, {newCredential})
        .next()
        .fork(saveUserCredential, {user, credential: newCredential})
        .next()
        .call(loadCredentialsForUser, user.uid)
        .next(credentials)
        .inspect(({payload: {action}}) => {
          assert.deepEqual(
            action,
            userAuthenticated(user, [credentials[1], newCredential]),
          );
        });
    });
    assert.end();
  });

  t.test('log out', assert => {
    assert.doesNotThrow(() => {
      testSaga(handleAuthChange, null).next().put(userLoggedOut());
    });
    assert.end();
  });

  t.end();
});
