import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import {Observable} from '../services/rxjs';
import {auth, database, githubAuthProvider} from '../services/appFirebase';

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
    if (!isNull(userCredential) && isNull(userCredential.credential)) {
      return auth.signOut().then(() => null);
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

function oneAuth() {
  return loginStateSource.first().toPromise();
}
