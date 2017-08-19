import Immutable from 'immutable';
import get from 'lodash/get';

const init = new Immutable.Map({
  authenticated: false,
  unconfirmedIdentity: null,
});

function user(stateIn, action) {
  const state = stateIn || init;

  switch (action.type) {
    case 'CONFIRM_IDENTITY': {
      const {user: userData, credential, additionalUserInfo} = action.payload;

      const profileData = get(userData, ['providerData', 0], userData);

      return state.merge({
        unconfirmedIdentity: {
          id: userData.uid,
          displayName: profileData.displayName || get(
            additionalUserInfo,
            'username',
          ),
          avatarUrl: profileData.photoURL,
          accessTokens: new Immutable.Map().set(
            credential.providerId,
            credential.accessToken,
          ),
        },
      });
    }

    case 'USER_AUTHENTICATED': {
      const updatedState = action.payload;

      updatedState.authenticated = true;
      updatedState.unconfirmedIdentity = null;

      return state.merge(updatedState);
    }

    case 'USER_LOGGED_OUT':
      return init;

    default:
      return state;
  }
}

export default user;
