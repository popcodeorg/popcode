import {createSelector} from 'reselect';

export default function makeUserIsAuthenticated() {
  return createSelector(
    state => state.getIn(['user', 'accessTokens']),
    (accessTokens) => {
      if (accessTokens) {
        if (accessTokens.get('github.com')) {
          return 'github.com';
        } else if (accessTokens.get('google.com')) {
          return 'google.com';
        }
      }
      return null;
    },
  );
}
