import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import {Observable} from '../services/rxjs';
import {auth, database, githubAuthProvider} from '../services/appFirebase';
import Cookies from 'js-cookie';

const VALID_SESSION_UID_COOKIE = 'firebaseAuth.validSessionUid';
const SESSION_TTL_MS = 5 * 60 * 1000;

const loginStateSource = Observable.create((observer) => {
  auth.onAuthStateChanged(observer.next.bind(observer));
}).switchMap((user) => {
  if (isNull(user)) {
    return Observable.of(null);
  }

  return Observable.fromPromise(userCredentialForUserData(user));
});

const [logOutSource, logInSource] = loginStateSource.skip(1).partition(isNull);

function userCredentialForUserData(user) {
  return database.ref(`authTokens/${user.uid}/github_com`).
    once('value').then((snapshot) => {
      const credential = snapshot.val();
      if (isNil(credential)) {
        return auth.signOut().then(() => null);
      }

      return {user, credential};
    });
}

export function getInitialUserState() {
  return oneAuth().then((userCredential) => {
    if (!isNull(userCredential)) {
      if (isNull(userCredential.credential)) {
        return auth.signOut().then(() => null);
      }

      if (userCredential.user.uid !== getSessionUid()) {
        return auth.signOut().then(() => null);
      }
    }

    return userCredential;
  });
}

export function onSignedIn(handler) {
  logInSource.subscribe(handler);
}

export function onSignedOut(handler) {
  logOutSource.subscribe(handler);
}

export function signIn() {
  return auth.signInWithPopup(githubAuthProvider).then(
    (userCredential) => {
      saveCredentials(userCredential.user.uid, userCredential.credential);
      return userCredential;
    }
  );
}

export function signOut() {
  return auth.signOut();
}

export function saveCredentials(uid, credential) {
  database.
    ref(`authTokens/${uid}/${credential.provider.replace('.', '_')}`).
    set(credential);
}

export function startSessionHeartbeat() {
  setInterval(setSessionUid, 1000);
}

function oneAuth() {
  return loginStateSource.first().toPromise();
}

function getSessionUid() {
  return Cookies.get(VALID_SESSION_UID_COOKIE);
}

export function setSessionUid() {
  Cookies.set(
    VALID_SESSION_UID_COOKIE,
    get(auth, 'currentUser.uid'),
    {expires: new Date(Date.now() + SESSION_TTL_MS)}
  );
}
