import * as firebase from 'firebase/app'; // eslint-disable-line import/no-namespace
import Cookies from 'js-cookie';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isNull from 'lodash-es/isNull';
import mapValues from 'lodash-es/mapValues';
import omit from 'lodash-es/omit';
import once from 'lodash-es/once';
import values from 'lodash-es/values';
import {v4 as uuid} from 'uuid';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/performance';
import 'firebase/remote-config';

import config from '../config';
import {
  getGapiSync,
  SCOPES as GOOGLE_SCOPES,
  loadAndConfigureGapi,
} from '../services/gapi';
import {bugsnagClient} from '../util/bugsnag';
import retryingFailedImports from '../util/retryingFailedImports';

const GITHUB_SCOPES = ['gist', 'public_repo', 'read:user', 'user:email'];
const VALID_SESSION_UID_COOKIE = 'firebaseAuth.validSessionUid';
const SESSION_TTL_MS = 5 * 60 * 1000;
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
for (const scope of GITHUB_SCOPES) {
  githubAuthProvider.addScope(scope);
}

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

for (const scope of GOOGLE_SCOPES) {
  googleAuthProvider.addScope(scope);
}

const {auth, loadDatabase, remoteConfig} = buildFirebase();

async function loadDatabaseSdk() {
  return retryingFailedImports(() =>
    import(
      /* webpackChunkName: "mainAsync" */
      'firebase/database'
    ),
  );
}

function buildFirebase(appName = undefined) {
  const app = firebase.initializeApp(
    {
      apiKey: config.firebaseApiKey,
      appId: config.firebaseAppId,
      authDomain: `${config.firebaseApp}.firebaseapp.com`,
      databaseURL: `https://${config.firebaseApp}.firebaseio.com`,
      measurementId: config.firebaseMeasurementId,
      projectId: config.firebaseProjectId,
    },
    appName,
  );

  const rest =
    appName === undefined
      ? {
          perf: firebase.performance(app),
          analytics: firebase.analytics(),
          remoteConfig: firebase.remoteConfig(),
        }
      : {perf: null, analytics: null, remoteConfig: null};

  return {
    auth: firebase.auth(app),

    loadDatabase: once(async () => {
      await loadDatabaseSdk();
      return firebase.database(app);
    }),

    ...rest,
  };
}

export function onAuthStateChanged(listener) {
  return auth.onAuthStateChanged(user => {
    listener({user});
  });
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
  const event = await database
    .ref('snapshots')
    .child(snapshotKey)
    .once('value');
  return event.val();
}

export async function saveProject(uid, project) {
  const userWorkspace = await workspace(uid);
  await userWorkspace
    .child('projects')
    .child(project.projectKey)
    .setWithPriority(project, -Date.now());
}

export async function loadCredentialsForUser(uid) {
  const database = await loadDatabase();
  const credentialEvent = await database.ref(`authTokens/${uid}`).once('value');
  return values(credentialEvent.val());
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
    return userCredential;
  } finally {
    setTimeout(() => {
      window.onerror = originalOnerror;
    });
  }
}

export async function linkGithub() {
  const {credential} = await auth.currentUser.linkWithPopup(githubAuthProvider);
  return {user: auth.currentUser, credential};
}

export async function unlinkGithub() {
  await Promise.all([
    auth.currentUser.unlink('github.com'),
    deleteCredentialForUser(auth.currentUser.uid, 'github.com'),
  ]);
}

export async function migrateAccount(inboundAccountCredential) {
  const inboundAccountFirebase = buildFirebase('migration');
  const {auth: inboundAccountAuth} = inboundAccountFirebase;
  try {
    await inboundAccountAuth.signInWithCredential(inboundAccountCredential);
    const inboundUid = inboundAccountAuth.currentUser.uid;
    await logMigration(inboundUid, 'attempt');

    const migratedProjects = await migrateProjects(inboundAccountFirebase);
    await migrateCredential(inboundAccountCredential, inboundAccountFirebase);

    await logMigration(inboundUid, 'success');

    return {user: auth.currentUser, migratedProjects};
  } finally {
    inboundAccountAuth.app.delete();
  }
}

async function migrateCredential(credential, {auth: inboundAccountAuth}) {
  await inboundAccountAuth.currentUser.unlink(credential.providerId);
  await auth.currentUser.linkWithCredential(credential);
  await saveCredentialForCurrentUser(credential);
}

async function migrateProjects({
  auth: inboundAccountAuth,
  loadDatabase: loadinboundAccountDatabase,
}) {
  const currentAccountDatabase = await loadDatabase();
  const inboundAccountDatabase = await loadinboundAccountDatabase();

  const allProjectsValue = await inboundAccountDatabase
    .ref(`workspaces/${inboundAccountAuth.currentUser.uid}/projects`)
    .once('value');

  if (isNull(allProjectsValue)) {
    return [];
  }
  const allProjects = allProjectsValue.val();

  if (isNull(allProjects) || isEmpty(allProjects)) {
    return [];
  }

  await currentAccountDatabase
    .ref(`workspaces/${auth.currentUser.uid}/projects`)
    .update(allProjects);

  return values(allProjects);
}

async function logMigration(inboundUid, eventName) {
  bugsnagClient.notify(new Error(`Account migration ${eventName}`), {
    metaData: {migration: {inboundUid}},
    severity: 'info',
  });
}

async function signInWithGithub() {
  return auth.signInWithPopup(githubAuthProvider);
}

async function signInWithGoogle() {
  const gapi = getGapiSync();
  const googleUser = await gapi.auth2
    .getAuthInstance()
    .signIn({prompt: 'select_account'});
  const googleCredential = googleAuthProvider.credential(
    googleUser.getAuthResponse().id_token,
  );
  return auth.signInAndRetrieveDataWithCredential(googleCredential);
}

export async function signOut() {
  const gapi = await loadAndConfigureGapi();
  if (await gapi.auth2.getAuthInstance().isSignedIn.get()) {
    gapi.auth2.getAuthInstance().signOut();
  }
  return auth.signOut();
}

export async function saveUserCredential({user: {uid}, credential}) {
  await saveCredentialForUser(uid, credential);
}

export async function saveCredentialForCurrentUser(credential) {
  await saveCredentialForUser(auth.currentUser.uid, credential);
}

async function saveCredentialForUser(uid, credential) {
  const database = await loadDatabase();
  await database
    .ref(`authTokens/${providerPath(uid, credential.providerId)}`)
    .set(credential);
}

async function deleteCredentialForUser(uid, providerId) {
  const database = await loadDatabase();
  await database.ref(`authTokens/${providerPath(uid, providerId)}`).remove();
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
  const uid = get(auth, ['currentUser', 'uid']);
  if (!isNil(uid)) {
    Cookies.set(VALID_SESSION_UID_COOKIE, uid, {
      expires: new Date(Date.now() + SESSION_TTL_MS),
    });
  }
}

export async function loadRemoteConfig() {
  await remoteConfig.fetchAndActivate();

  return mapValues(remoteConfig.getAll(), value => value.asString());
}
