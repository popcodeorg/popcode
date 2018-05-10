import {firebase} from '@firebase/app';
import once from 'lodash/once';
import '@firebase/auth';
import config from '../config';
import retryingFailedImports from '../util/retryingFailedImports';

const appFirebase = firebase.initializeApp({
  apiKey: config.firebaseApiKey,
  authDomain: `${config.firebaseApp}.firebaseapp.com`,
  databaseURL: `https://${config.firebaseApp}.firebaseio.com`,
});

export const auth = firebase.auth(appFirebase);
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
githubAuthProvider.addScope('gist');
githubAuthProvider.addScope('public_repo');

export const loadDatabase = once(async() => {
  await retryingFailedImports(() =>
    import(
      /* webpackChunkName: 'mainAsync' */
      '@firebase/database',
    ),
  );
  return firebase.database(appFirebase);
});
