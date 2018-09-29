import isUserAuthenticated from './isUserAuthenticated';

export default function makeIsUserAuthenticatedWith(provider) {
  return function isUserAuthenticatedWithProvider(state) {
    return isUserAuthenticated(state) &&
      Boolean(state.getIn(['user', 'account', 'accessTokens', provider]));
  };
}
