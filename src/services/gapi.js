/* global gapi */
import $S from 'scriptjs';
import once from 'lodash/once';
import config from '../config';

export async function initGapi() {
  return new Promise((resolve) => {
    $S('https://apis.google.com/js/client.js', () => {
      resolve(gapi);
    });
  });
}

export async function initGapiClient(gapi) {
  const client = await new Promise((resolve, reject) => {
    gapi.load('client', {
      callback: () => {
        resolve(gapi.client);
      },
      onerror: (e) => {
        reject(e);
      },
      timeout: 5000,
      ontimeout: () => {
        reject(new Error('Timed out'));
      },
    });
  });
  await client.load(
    'https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest',
  );

  return client;
}

export function authenticateGapiClient(client, accessToken) {
  client.setApiKey(config.firebaseApiKey);
  client.setToken({
    access_token: accessToken,
  });
  return client;
}
