import linkGithubIdentity from './linkGithubIdentity';
import logout from './logout';
import startAccountMigration from './startAccountMigration';
import projectSuccessfullySaved from './projectSuccessfullySaved';
import unlinkGithubIdentity from './unlinkGithubIdentity';
import validateCurrentProject from './validateCurrentProject';
import validateProjectOnChange from './validateProjectOnChange';
import saveProject from './saveProject';
import instrumentEnvironmentReady from './instrumentEnvironmentReady';
import instrumentApplicationLoaded from './instrumentApplicationLoaded';

export default [
  instrumentApplicationLoaded,
  instrumentEnvironmentReady,
  linkGithubIdentity,
  logout,
  startAccountMigration,
  unlinkGithubIdentity,
  validateCurrentProject,
  validateProjectOnChange,
  projectSuccessfullySaved,
  saveProject,
];
