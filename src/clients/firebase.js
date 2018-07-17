import Cookies from 'js-cookie';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import isNil from 'lodash-es/isNil';
import isNull from 'lodash-es/isNull';
import map from 'lodash-es/map';
import omit from 'lodash-es/omit';
import values from 'lodash-es/values';
import uuid from 'uuid/v4';

import {getGapiSync} from '../services/gapi';
import {
  auth,
  loadDatabase,
  githubAuthProvider,
  googleAuthProvider,
} from '../services/appFirebase';

const VALID_SESSION_UID_COOKIE = 'firebaseAuth.validSessionUid';
const SESSION_TTL_MS = 5 * 60 * 1000;

export function onAuthStateChanged(listener) {
  const unsubscribe = auth.onAuthStateChanged(async(user) => {
    if (isNull(user)) {
      listener({user: null});
    } else {
      listener(await decorateUserWithCredentials(user));
    }
  });
  return unsubscribe;
}

async function workspace(uid) {
  const database = await loadDatabase();
  return database.ref(`workspaces/${uid}`);
}

export async function loadAllProjects(uid) {
  const userWorkspace = await workspace(uid);
  const projects = await userWorkspace.child('projects').once('value');
  return values(projects.val() || {});
}

function getProjectforSnapshot(project) {
  const snapshotBlacklist = ['externalLocations'];
  return omit(project, snapshotBlacklist);
}

export async function createProjectSnapshot(project) {
  const snapshotKey = uuid().toString();
  const database = await loadDatabase();
  const projectForSnapshot = getProjectforSnapshot(project);
  await database.ref('snapshots').child(snapshotKey).set(projectForSnapshot);
  return snapshotKey;
}

export async function loadProjectSnapshot(snapshotKey) {
  const database = await loadDatabase();
  const event =
    await database.ref('snapshots').child(snapshotKey).once('value');
  return event.val();
}

export async function saveProject(uid, project) {
  const userWorkspace = await workspace(uid);
  await userWorkspace.child('projects').child(project.projectKey).
    setWithPriority(project, -Date.now());
}

async function decorateUserWithCredentials(user) {
  const database = await loadDatabase();
  const credentialEvent =
    await database.ref(`authTokens/${user.uid}`).once('value');
  const credentials = values(credentialEvent.val() || {});
  if (
    !isEqual(
      map(credentials, 'providerId').sort(),
      map(user.providerData, 'providerId').sort(),
    )
  ) {
    await auth.signOut();
    return {user: null};
  }

  return {user, credentials};
}

export async function signIn(provider) {
  const originalOnerror = window.onerror;
  window.onerror = message => message.toLowerCase().includes('network error');
  try {
    let userCredential;
    if (provider === 'github') {
      userCredential = await signInWithGithub();
    } else if (provider === 'google') {
      userCredential = await signInWithGoogle();
    }
    await saveUserCredential(userCredential);
    return userCredential;
  } finally {
    setTimeout(() => {
      window.onerror = originalOnerror;
    });
  }
}

export async function linkGithub() {
  const userCredential =
    await auth.currentUser.linkWithPopup(githubAuthProvider);
  await saveUserCredential(userCredential);
  return userCredential.credential;
}

async function signInWithGithub() {
  return auth.signInWithPopup(githubAuthProvider);
}

async function signInWithGoogle() {
  const gapi = getGapiSync();
  const googleUser =
    await gapi.auth2.getAuthInstance().signIn({prompt: 'select_account'});
  const googleCredential =
    googleAuthProvider.credential(googleUser.getAuthResponse().id_token);
  return auth.signInAndRetrieveDataWithCredential(googleCredential);
}

export async function signOut() {
  const gapi = getGapiSync();
  if (await gapi.auth2.getAuthInstance().isSignedIn.get()) {
    gapi.auth2.getAuthInstance().signOut();
  }
  return auth.signOut();
}

async function saveUserCredential({
  user: {uid},
  credential,
}) {
  const database = await loadDatabase();
  await database.
    ref(`authTokens/${providerPath(uid, credential.providerId)}`).
    set(credential);
}

function providerPath(uid, providerId) {
  return `${uid}/${providerId.replace('.', '_')}`;
}

export function startSessionHeartbeat() {
  setInterval(setSessionUid, 1000);
}

export function getSessionUid() {
  return Cookies.get(VALID_SESSION_UID_COOKIE);
}

export function setSessionUid() {
  const uid = get(auth, 'currentUser.uid');
  if (!isNil(uid)) {
    Cookies.set(
      VALID_SESSION_UID_COOKIE,
      uid,
      {expires: new Date(Date.now() + SESSION_TTL_MS)},
    );
  }
}
