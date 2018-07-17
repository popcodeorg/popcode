import {createAction} from 'redux-actions';

export const logIn = createAction(
  'LOG_IN',
  provider => ({provider}),
);

export const linkGithubIdentity = createAction('LINK_GITHUB_IDENTITY');

export const identityLinked = createAction(
  'IDENTITY_LINKED',
  credential => ({credential}),
);

export const linkIdentityFailed = createAction(
  'LINK_IDENTITY_FAILED',
  error => ({error}),
);

export const logOut = createAction('LOG_OUT');

export const userAuthenticated = createAction(
  'USER_AUTHENTICATED',
  (user, credentials) => ({user, credentials}),
);

export const userLoggedOut = createAction('USER_LOGGED_OUT');
