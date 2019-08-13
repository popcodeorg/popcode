import test from 'tape-catch';
import {testSaga} from 'redux-saga-test-plan';
import {delay, take, race} from 'redux-saga/effects';

import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationUndoPeriodExpired,
  logOut,
  startAccountMigration,
} from '../../../src/actions/user';
import {getCurrentAccountMigration} from '../../../src/selectors';
import {AccountMigration} from '../../../src/records';
import {migrateAccount, signOut} from '../../../src/clients/firebase';
import {
  logOut as logOutSaga,
  startAccountMigration as startAccountMigrationSaga,
} from '../../../src/sagas/user';
import {bugsnagClient} from '../../../src/util/bugsnag';

test('startAccountMigration', t => {
  const user = {};
  const firebaseCredential = {};
  const migratedProjects = [{}];
  const migration = new AccountMigration().set(
    'firebaseCredential',
    firebaseCredential,
  );

  t.test('not dismissed during undo period, successful migration', assert => {
    testSaga(startAccountMigrationSaga, startAccountMigration())
      .next()
      .inspect(effect => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: delay(5000, true),
            cancel: take('DISMISS_ACCOUNT_MIGRATION'),
          }),
        );
      })
      .next({shouldContinue: true, cancel: null})
      .put(accountMigrationUndoPeriodExpired())
      .next()
      .select(getCurrentAccountMigration)
      .next(migration)
      .call(migrateAccount, firebaseCredential)
      .next({user, migratedProjects})
      .put(accountMigrationComplete(user, firebaseCredential, migratedProjects))
      .next()
      .isDone();
    assert.end();
  });

  t.test('not dismissed during undo period, error in migration', assert => {
    const error = new Error('Migration error');
    testSaga(startAccountMigrationSaga, startAccountMigration())
      .next()
      .inspect(effect => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: delay(5000, true),
            cancel: take('DISMISS_ACCOUNT_MIGRATION'),
          }),
        );
      })
      .next({shouldContinue: true, cancel: null})
      .put(accountMigrationUndoPeriodExpired())
      .next()
      .select(getCurrentAccountMigration)
      .next(migration)
      .call(migrateAccount, firebaseCredential)
      .throw(error)
      .call([bugsnagClient, 'notify'], error)
      .next()
      .put(accountMigrationError(error))
      .next()
      .isDone();
    assert.end();
  });

  t.test('dismissed during undo period', assert => {
    testSaga(startAccountMigrationSaga, startAccountMigration())
      .next()
      .inspect(effect => {
        assert.deepEqual(
          effect,
          race({
            shouldContinue: delay(5000, true),
            cancel: take('DISMISS_ACCOUNT_MIGRATION'),
          }),
        );
      })
      .next({
        shouldContinue: null,
        cancel: {type: 'DISMISS_ACCOUNT_MIGRATION'},
      })
      .isDone();
    assert.end();
  });
});

test('logOut', assert => {
  testSaga(logOutSaga, logOut())
    .next()
    .call(signOut);

  assert.end();
});
