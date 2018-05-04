/* global gapi */
import $S from 'scriptjs';
import once from 'lodash/once';
import config from '../config';

export const loadGapi = once(async() => new Promise((resolve) => {
  $S('https://apis.google.com/js/client.js', async() => {
    resolve(gapi);
  });
}));

export const getGapi = once(async() => {
  let gapi = await loadGapi();
  gapi = await new Promise((resolve, reject) => {
    gapi.load('client:auth2', {
      callback: () => {
        resolve(gapi);
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
  await gapi.client.init({
    apiKey: config.firebaseApiKey,
    clientId: config.firebaseClientId,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest'],
    scope: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me',
  });

  return gapi;
});
