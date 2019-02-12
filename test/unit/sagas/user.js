import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {delay, take, race} from 'redux-saga/effects';

import {linkGithubIdentity} from '../../../src/actions';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  identityLinked,
  linkIdentityFailed,
  logOut,
  startAccountMigration,
} from '../../../src/actions/user';
import {getCurrentAccountMigration} from '../../../src/selectors';
import {
  AccountMigration,
} from '../../../src/records';
import {
  linkGithub,
  migrateAccount,
  signOut,
  saveCredentialForCurrentUser,
} from '../../../src/clients/firebase';
import {getProfileForAuthenticatedUser} from '../../../src/clients/github';
import {
  logOut as logOutSaga,
  linkGithubIdentity as linkGithubIdentitySaga,
  startAccountMigration as startAccountMigrationSaga,
} from '../../../src/sagas/user';
import {bugsnagClient} from '../../../src/util/bugsnag';

test('linkGithubIdentity', (t) => {
  t.test('success', (assert) => {
    const credential = {providerId: 'github.com'};

    testSaga(linkGithubIdentitySaga, linkGithubIdentity()).
      next().call(linkGithub).
      next(credential).call(saveCredentialForCurrentUser, credential).
      next().put(identityLinked(credential));

    assert.end();
  });

  t.test('credential already in use in experimental mode', (assert) => {
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
      throw(error).call([bugsnagClient, 'notify'], error).
      next().put(linkIdentityFailed(error)).
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

  t.test(
    'not dismissed during undo period, successful migration',
    (assert) => {
      testSaga(startAccountMigrationSaga, startAccountMigration()).
        next().inspect((effect) => {
          assert.deepEqual(
            effect,
            race({
              shouldContinue: delay(5000, true),
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
    },
  );

  t.test('not dismissed during undo period, error in migration', (assert) => {
    const error = new Error('Migration error');
    testSaga(startAccountMigrationSaga, startAccountMigration()).
      next().inspect((effect) => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: delay(5000, true),
            cancel: take('DISMISS_ACCOUNT_MIGRATION'),
          }),
        );
      }).
      next({shouldContinue: true, cancel: null}).
      put(accountMigrationUndoPeriodExpired()).
      next().select(getCurrentAccountMigration).
      next(migration).call(migrateAccount, firebaseCredential).
      throw(error).call([bugsnagClient, 'notify'], error).next().
      put(accountMigrationError(error)).
      next().isDone();
    assert.end();
  });

  t.test('dismissed during undo period', (assert) => {
    testSaga(startAccountMigrationSaga, startAccountMigration()).
      next().inspect((effect) => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: delay(5000, true),
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
