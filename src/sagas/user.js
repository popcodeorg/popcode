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
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  identityLinked,
  linkIdentityFailed,
  accountMigrationError,
  identityUnlinked,
} from '../actions/user';
import {getCurrentAccountMigration} from '../selectors';
import {
  linkGithub,
  migrateAccount,
  signOut,
  saveCredentialForCurrentUser,
  unlinkGithub,
} from '../clients/firebase';
import {getProfileForAuthenticatedUser} from '../clients/github';

export function* linkGithubIdentity() {
  try {
    const {user: userData, credential} = yield call(linkGithub);
    yield call(saveCredentialForCurrentUser, credential);
    yield put(identityLinked(userData, credential));
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

export function* unlinkGithubIdentity() {
  yield call(unlinkGithub);
  yield put(identityUnlinked('github.com'));
}

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
    const {user: userData, migratedProjects} =
      yield call(migrateAccount, firebaseCredential);

    yield put(accountMigrationComplete(
      userData,
      firebaseCredential,
      migratedProjects,
    ));
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
    takeEvery('LINK_GITHUB_IDENTITY', linkGithubIdentity),
    takeEvery('UNLINK_GITHUB_IDENTITY', unlinkGithubIdentity),
    takeEvery('LOG_OUT', logOut),
    takeEvery('START_ACCOUNT_MIGRATION', startAccountMigration),
  ]);
}
