import loadjs from 'loadjs';
import once from 'lodash-es/once';
import promiseRetry from 'promise-retry';

import config from '../config';
import ExtendableError from '../util/ExtendableError';

export const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.coursework.me',
];

const DISCOVERY_DOCS = [
  'https://classroom.googleapis.com/$discovery/rest?version=v1',
];

class LoadError extends ExtendableError {}

let isGapiLoadedAndConfigured = false;

const loadGapi = once(() =>
  promiseRetry(
    async retry => {
      try {
        return await new Promise((resolve, reject) => {
          loadjs('https://apis.google.com/js/client.js', {
            success() {
              resolve(window.gapi);
            },
            error(failedPaths) {
              reject(new LoadError(`Failed to load ${failedPaths.join(', ')}`));
            },
          });
        });
      } catch (e) {
        return retry(e);
      }
    },
    {
      retries: 16,
      factor: 2,
      minTimeout: 200,
      maxTimeout: 4000,
    },
  ),
);

export const loadAndConfigureGapi = once(async () => {
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
    scope: SCOPES.join(' '),
  });

  isGapiLoadedAndConfigured = true;

  return gapi;
});

export function getGapiSync() {
  if (!isGapiLoadedAndConfigured) {
    throw new Error(
      'Attempted to synchronously access `gapi` before it was loaded',
    );
  }

  return window.gapi;
}
