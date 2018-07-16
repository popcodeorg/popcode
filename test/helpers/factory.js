import defaultsDeep from 'lodash-es/defaultsDeep';
import isNil from 'lodash-es/isNil';
import merge from 'lodash-es/merge';

export function gistData({
  html, css, javascript, enabledLibraries, hiddenUIComponents,
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

export function userWithCredentials({
  user: userIn,
  credential: credentialIn,
} = {}) {
  return {
    user: user(userIn),
    credentials: [credential(credentialIn)],
  };
}

export function user(userIn) {
  return defaultsDeep({}, userIn, {
    displayName: 'Popcode User',
    photoURL: 'https://camo.github.com/popcodeuser.jpg',
    uid: 'abc123',
  });
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

export function credential(credentialIn) {
  return merge({
    accessToken: '0123456789abcdef',
    providerId: 'github.com',
  }, credentialIn);
}
