import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  applicationLoaded,
  linkGithubIdentity,
  notificationTriggered,
  userLoggedOut,
} from '../../../src/actions';
import {
  identityLinked,
  linkIdentityFailed,
  logIn,
  logOut,
  userAuthenticated,
} from '../../../src/actions/user';
import {
  getSessionUid,
  linkGithub,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../../../src/clients/firebase';
import {
  applicationLoaded as applicationLoadedSaga,
  logIn as logInSaga,
  logOut as logOutSaga,
  linkGithubIdentity as linkGithubIdentitySaga,
} from '../../../src/sagas/user';
import {loginState} from '../../../src/channels';
import {
  userWithCredentials as createUserWithCredentials,
} from '../../helpers/factory';
import {bugsnagClient} from '../../../src/util/bugsnag';

class MockFirebaseError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

test('applicationLoaded', (t) => {
  t.test('with no logged in user', (assert) => {
    testSaga(applicationLoadedSaga, applicationLoaded()).
      next().call(startSessionHeartbeat).
      next().take(loginState).
      next({user: null}).put(userLoggedOut());

    assert.end();
  });

  t.test('with logged in user', (assert) => {
    const {user, credentials} = createUserWithCredentials();
    testSaga(applicationLoadedSaga, applicationLoaded()).
      next().call(startSessionHeartbeat).
      next().take(loginState).
      next({user, credentials}).call(getSessionUid).
      next(user.uid).put(userAuthenticated(user, credentials));

    assert.end();
  });

  t.test('with expired session', (assert) => {
    const {user, credentials} = createUserWithCredentials();
    testSaga(applicationLoadedSaga, applicationLoaded()).
      next().call(startSessionHeartbeat).
      next().take(loginState).
      next({user, credentials}).call(getSessionUid).
      next(undefined).call(signOut);

    assert.end();
  });
});

const provider = 'google';

test('logIn', (t) => {
  t.test('success', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      next().isDone();

    assert.end();
  });

  t.test('popup closed by user', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(new MockFirebaseError('auth/popup-closed-by-user')).
      put(notificationTriggered('user-cancelled-auth')).
      next().isDone();

    assert.end();
  });

  t.test('network request failed', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(new MockFirebaseError('auth/network-request-failed')).
      put(notificationTriggered('auth-network-error')).
      next().isDone();

    assert.end();
  });

  t.test('cancelled popup request', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(new MockFirebaseError('auth/cancelled-popup-request')).
      next().isDone();

    assert.end();
  });

  t.test('web storage unsupported', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(new MockFirebaseError('auth/web-storage-unsupported')).
      put(notificationTriggered('auth-third-party-cookies-disabled')).
      next().isDone();

    assert.end();
  });

  t.test('operation not supported in this environment', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(new MockFirebaseError(
        'auth/operation-not-supported-in-this-environment',
      )).put(notificationTriggered('auth-third-party-cookies-disabled')).
      next().isDone();

    assert.end();
  });

  t.test('internal error', (assert) => {
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(new MockFirebaseError('auth/internal-error')).
      put(notificationTriggered('auth-error')).
      next().isDone();

    assert.end();
  });

  t.test('unrecognized error', (assert) => {
    const e = new MockFirebaseError('auth/bogus-error');
    testSaga(logInSaga, logIn(provider)).
      next().call(signIn, provider).
      throw(e).put(notificationTriggered('auth-error')).
      next().call(
        [bugsnagClient, 'notify'],
        e,
        {metaData: {code: 'auth/bogus-error'}},
      ).
      next().isDone();

    assert.end();
  });
});

test('linkGithubIdentity', (t) => {
  t.test('success', (assert) => {
    const credential = {providerId: 'github.com'};

    testSaga(linkGithubIdentitySaga, linkGithubIdentity()).
      next().call(linkGithub).
      next(credential).put(identityLinked(credential));

    assert.end();
  });

  t.test('error', (assert) => {
    const error = new Error('authentication problem!');

    testSaga(linkGithubIdentitySaga, linkGithubIdentity()).
      next().call(linkGithub).
      throw(error).put(linkIdentityFailed(error));

    assert.end();
  });
});

test('logOut', (assert) => {
  testSaga(logOutSaga, logOut()).
    next().call(signOut);

  assert.end();
});
