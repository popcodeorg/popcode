import defaultsDeep from 'lodash/defaultsDeep';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';

export function gistData({html, css, javascript, enabledLibraries = []} = {}) {
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
  if (!isEmpty(enabledLibraries)) {
    files.push({
      language: 'JSON',
      filename: 'popcode.json',
      content: JSON.stringify({enabledLibraries}),
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
  return merge({
    displayName: null,
    photoURL: null,
    providerData: [{
      displayName: 'Popcode User',
      email: 'popcodeuser@example.com',
      photoURL: 'https://camo.github.com/popcodeuser.jpg',
      providerId: 'github.com',
      uid: '345',
    }],
    uid: 'abc123',
  }, userIn);
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
    updatedAt: Date.now(),
  });
}

export function credential(credentialIn) {
  return merge({
    accessToken: '0123456789abcdef',
    provider: 'github.com',
  }, credentialIn);
}
