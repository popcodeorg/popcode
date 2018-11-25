import {bugsnagClient} from '../util/bugsnag';
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
import {
  accountMigrationComplete,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  identityLinked,
  linkIdentityFailed,
  accountMigrationError,
} from '../actions/user';
import {getCurrentAccountMigration} from '../selectors';
import {
  linkGithub,
  migrateAccount,
  signOut,
  saveCredentialForCurrentUser,
} from '../clients/firebase';
import {getProfileForAuthenticatedUser} from '../clients/github';

export function* linkGithubIdentity() {
  try {
    const credential = yield call(linkGithub);
    yield call(saveCredentialForCurrentUser, credential);
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
    takeEvery('LINK_GITHUB_IDENTITY', linkGithubIdentity),
    takeEvery('LOG_OUT', logOut),
    takeEvery('START_ACCOUNT_MIGRATION', startAccountMigration),
  ]);
}
