import {createAction} from 'redux-actions';

export const logIn = createAction('LOG_IN', provider => ({provider}));

export const linkGithubIdentity = createAction('LINK_GITHUB_IDENTITY');

export const unlinkGithubIdentity = createAction('UNLINK_GITHUB_IDENTITY');

export const identityLinked = createAction(
  'IDENTITY_LINKED',
  (user, credential) => ({user, credential}),
);

export const linkIdentityFailed = createAction(
  'LINK_IDENTITY_FAILED',
  error => ({error}),
);

export const identityUnlinked = createAction(
  'IDENTITY_UNLINKED',
  providerId => ({providerId}),
);

export const accountMigrationNeeded = createAction(
  'ACCOUNT_MIGRATION_NEEDED',
  (profile, credential) => ({profile, credential}),
);

export const startAccountMigration = createAction('START_ACCOUNT_MIGRATION');

export const dismissAccountMigration = createAction(
  'DISMISS_ACCOUNT_MIGRATION',
);

export const accountMigrationUndoPeriodExpired = createAction(
  'ACCOUNT_MIGRATION_UNDO_PERIOD_EXPIRED',
);

export const accountMigrationComplete = createAction(
  'ACCOUNT_MIGRATION_COMPLETE',
  (user, credential, projects) => ({user, credential, projects}),
);

export const accountMigrationError = createAction(
  'ACCOUNT_MIGRATION_ERROR',
  error => ({error}),
);

export const logOut = createAction('LOG_OUT');

export const userAuthenticated = createAction(
  'USER_AUTHENTICATED',
  (user, credentials) => ({user, credentials}),
);

export const userLoggedOut = createAction('USER_LOGGED_OUT');
