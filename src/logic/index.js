import linkGithubIdentity from './linkGithubIdentity';
import logout from './logout';
import startAccountMigration from './startAccountMigration';
import unlinkGithubIdentity from './unlinkGithubIdentity';
import errors from './errors';

export default [
  linkGithubIdentity,
  logout,
  startAccountMigration,
  unlinkGithubIdentity,
  ...errors,
];
