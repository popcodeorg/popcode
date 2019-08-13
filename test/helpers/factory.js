import defaultsDeep from 'lodash-es/defaultsDeep';
import isNil from 'lodash-es/isNil';

export function gistData({
  html,
  css,
  javascript,
  enabledLibraries,
  hiddenUIComponents,
} = {}) {
  const files = [];
  if (!isNil(html)) {
    files.push({language: 'HTML', filename: 'index.html', content: html});
  }
  if (!isNil(css)) {
    files.push({language: 'CSS', filename: 'styles.css', content: css});
  }
  if (!isNil(javascript)) {
    files.push({
      language: 'JavaScript',
      filename: 'script.js',
      content: javascript,
    });
  }
  if (enabledLibraries || hiddenUIComponents) {
    files.push({
      language: 'JSON',
      filename: 'popcode.json',
      content: JSON.stringify({enabledLibraries, hiddenUIComponents}),
    });
  }
  return {files};
}

export function userCredential({user: userIn, credential: credentialIn} = {}) {
  return {
    user: user(userIn),
    credential: credential(credentialIn),
  };
}

export function user(userIn) {
  return defaultsDeep({}, userIn, {
    displayName: 'Popcode User',
    photoURL: 'https://google.com/popcodeuser.jpg',
    uid: 'abc123',
    providerData: [
      {
        displayName: 'Popcode User',
        photoURL: 'https://google.com/popcodeuser.jpg',
        providerId: 'google.com',
      },
    ],
  });
}

export function credential(credentialIn = {}) {
  if (credentialIn.providerId === 'github.com') {
    return githubCredential(credentialIn.accessToken);
  }
  return googleCredential(credentialIn.idToken);
}

export function googleCredential(idToken = '0123456789abcdef') {
  return {providerId: 'google.com', idToken};
}

export function githubCredential(accessToken) {
  return {providerId: 'github.com', accessToken};
}

export function project(projectIn) {
  return defaultsDeep({}, projectIn, {
    projectKey: Date.now().toString(),
    sources: {
      html: '<!doctype html>My Website',
      css: 'p { }',
      javascript: 'alert("Hi")',
    },
    enabledLibraries: [],
    hiddenUIComponents: ['console'],
    updatedAt: Date.now(),
  });
}
export function course(courseIn) {
  return defaultsDeep({}, courseIn, {
    alternateLink: 'http://classroom.google.com/c/MTA4MDA5MDIwNDha',
    courseState: 'ACTIVE',
    creationTime: '2018-01-22T22:16:25.726Z',
    descriptionHeading: '2018-2019 Program Manager Tech Training',
    guardiansEnabled: true,
    id: '10800902048',
    name: '2018-2019 Sample Class',
    updateTime: '2018-10-01T18:11:58.432Z',
  });
}
