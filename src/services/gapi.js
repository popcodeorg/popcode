import $S from 'scriptjs';
import once from 'lodash-es/once';

import config from '../config';

import {GOOGLE_SCOPES} from './appFirebase';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest'];

const loadGapi = once(async() => new Promise((resolve) => {
  $S('https://apis.google.com/js/client.js', async() => {
    resolve(window.gapi);
  });
}));

export const loadAndConfigureGapi = once(async() => {
  const gapi = await loadGapi();
  await new Promise((resolve, reject) => {
    gapi.load('client:auth2', {
      callback: () => {
        resolve(gapi);
      },
      onerror: reject,
      timeout: 5000,
      ontimeout: () => {
        reject(new Error('Timed out'));
      },
    });
  });
  await gapi.client.init({
    apiKey: config.firebaseApiKey,
    clientId: config.firebaseClientId,
    discoveryDocs: DISCOVERY_DOCS,
    scope: GOOGLE_SCOPES.join(' '),
  });

  return gapi;
});

export function getGapiSync() {
  if ('gapi' in window) {
    return window.gapi;
  }
  throw new Error(
    'Attempted to synchronously access `gapi` before it was loaded',
  );
}
