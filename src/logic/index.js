import instrumentApplicationLoaded from './instrumentApplicationLoaded';
import instrumentEnvironmentReady from './instrumentEnvironmentReady';
import linkGithubIdentity from './linkGithubIdentity';
import logout from './logout';
import projectSuccessfullySaved from './projectSuccessfullySaved';
import saveProject from './saveProject';
import startAccountMigration from './startAccountMigration';
import unlinkGithubIdentity from './unlinkGithubIdentity';

export default [
  instrumentApplicationLoaded,
  instrumentEnvironmentReady,
  linkGithubIdentity,
  logout,
  startAccountMigration,
  unlinkGithubIdentity,
  projectSuccessfullySaved,
  saveProject,
];
