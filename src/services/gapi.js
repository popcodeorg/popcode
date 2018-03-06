/* global gapi */
import $S from 'scriptjs';
import config from '../config';

export function initGapi({credential}) {
  $S('https://apis.google.com/js/client.js', () => {
    loadGapi(credential);
  });
}

function loadGapi(credential) {
  gapi.load('client', {
    callback: () => {
      // Handle gapi.client initialization.
      initGapiClient(credential);
    },
    onerror: () => {
      // Handle loading error.
    },
    timeout: 5000,
    ontimeout: () => {
      // Handle timeout.
    },
  });
}

async function initGapiClient({accessToken}) {
  await gapi.client.setApiKey(config.firebaseApiKey);
  await gapi.client.setToken({
    access_token: accessToken,
  });
  await gapi.client.load(
    'https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest',
  );
  listCourses();
}

async function listCourses() {
  const courses = await gapi.client.classroom.courses.list();
  console.log(courses);
}
