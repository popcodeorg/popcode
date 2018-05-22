import {createSelector} from 'reselect';

export default function makeIsUserAuthenticatedWith(provider) {
  return createSelector(
    state => state.getIn(['user', 'accessTokens']),
    accessTokens => accessTokens ? Boolean(accessTokens.get(provider)) : false,
  );
}
