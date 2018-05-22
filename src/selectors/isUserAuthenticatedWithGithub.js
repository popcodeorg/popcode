import makeIsUserAuthenticatedWith from './makeIsUserAuthenticatedWith';

const isUserAuthenticatedWithGithub =
  makeIsUserAuthenticatedWith('github.com');
export default isUserAuthenticatedWithGithub;
