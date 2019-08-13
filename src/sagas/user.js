import {bugsnagClient} from '../util/bugsnag';
import {
  all,
  call,
  delay,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import {
  accountMigrationComplete,
  accountMigrationUndoPeriodExpired,
  accountMigrationError,
} from '../actions/user';
import {getCurrentAccountMigration} from '../selectors';
import {migrateAccount, signOut} from '../clients/firebase';

export function* startAccountMigration() {
  const {shouldContinue} = yield race({
    shouldContinue: delay(5000, true),
    cancel: take('DISMISS_ACCOUNT_MIGRATION'),
  });

  if (!shouldContinue) {
    return;
  }

  yield put(accountMigrationUndoPeriodExpired());
  const {firebaseCredential} = yield select(getCurrentAccountMigration);
  try {
    const {user: userData, migratedProjects} = yield call(
      migrateAccount,
      firebaseCredential,
    );

    yield put(
      accountMigrationComplete(userData, firebaseCredential, migratedProjects),
    );
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
    takeEvery('LOG_OUT', logOut),
    takeEvery('START_ACCOUNT_MIGRATION', startAccountMigration),
  ]);
}
