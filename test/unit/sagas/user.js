import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {delay} from 'redux-saga';
import {call, take, race} from 'redux-saga/effects';

import {
  applicationLoaded,
  linkGithubIdentity,
  notificationTriggered,
  userLoggedOut,
} from '../../../src/actions';
import {
  accountMigrationComplete,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  identityLinked,
  linkIdentityFailed,
  logIn,
  logOut,
  startAccountMigration,
  userAuthenticated,
} from '../../../src/actions/user';
import {
  getCurrentAccountMigration,
} from '../../../src/selectors';
import {
  AccountMigration,
} from '../../../src/records';
import {
  getSessionUid,
  linkGithub,
  migrateAccount,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../../../src/clients/firebase';
import {getProfileForAuthenticatedUser} from '../../../src/clients/github';
import {
  applicationLoaded as applicationLoadedSaga,
  logIn as logInSaga,
  logOut as logOutSaga,
  linkGithubIdentity as linkGithubIdentitySaga,
  startAccountMigration as startAccountMigrationSaga,
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

  t.test('credential already in use', (assert) => {
    const error = new Error('credential already in use');
    error.code = 'auth/credential-already-in-use';
    error.credential = {providerId: 'github.com', accessToken: 'abc123'};

    const githubProfile = {login: 'popcoder'};

    testSaga(linkGithubIdentitySaga, linkGithubIdentity()).
      next().call(linkGithub).
      throw(error).call(
        getProfileForAuthenticatedUser,
        error.credential.accessToken,
      ).
      next({status: 200, data: githubProfile}).put(
        accountMigrationNeeded(githubProfile, error.credential),
      ).next().isDone();

    assert.end();
  });

  t.test('other error', (assert) => {
    const error = new Error('authentication problem!');

    testSaga(linkGithubIdentitySaga, linkGithubIdentity()).
      next().call(linkGithub).
      throw(error).put(linkIdentityFailed(error)).
      next().isDone();

    assert.end();
  });
});

test('startAccountMigration', (t) => {
  const firebaseCredential = {};
  const loadedProjects = [{}];
  const migration = new AccountMigration().set(
    'firebaseCredential',
    firebaseCredential,
  );

  t.test('not dismissed during undo period', (assert) => {
    testSaga(startAccountMigrationSaga, startAccountMigration()).
      next().inspect((effect) => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: call(delay, 5000, true),
            cancel: take('DISMISS_ACCOUNT_MIGRATION'),
          }),
        );
      }).
      next({shouldContinue: true, cancel: null}).
      put(accountMigrationUndoPeriodExpired()).
      next().select(getCurrentAccountMigration).
      next(migration).call(migrateAccount, firebaseCredential).
      next(loadedProjects).
      put(accountMigrationComplete(loadedProjects, firebaseCredential)).
      next().isDone();
    assert.end();
  });

  t.test('not dismissed during undo period', (assert) => {
    testSaga(startAccountMigrationSaga, startAccountMigration()).
      next().inspect((effect) => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: call(delay, 5000, true),
            cancel: take('DISMISS_ACCOUNT_MIGRATION'),
          }),
        );
      }).
      next({
        shouldContinue: null,
        cancel: {type: 'DISMISS_ACCOUNT_MIGRATION'},
      }).isDone();
    assert.end();
  });
});

test('logOut', (assert) => {
  testSaga(logOutSaga, logOut()).
    next().call(signOut);

  assert.end();
});
