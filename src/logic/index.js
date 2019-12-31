import linkGithubIdentity from './linkGithubIdentity';
import logout from './logout';
import startAccountMigration from './startAccountMigration';
import projectSuccessfullySaved from './projectSuccessfullySaved';
import unlinkGithubIdentity from './unlinkGithubIdentity';
import saveProject from './saveProject';
import instrumentEnvironmentReady from './instrumentEnvironmentReady';

export default [
  instrumentEnvironmentReady,
  linkGithubIdentity,
  logout,
  startAccountMigration,
  unlinkGithubIdentity,
  projectSuccessfullySaved,
  saveProject,
];
