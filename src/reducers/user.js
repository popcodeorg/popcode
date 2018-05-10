import Immutable from 'immutable';
import get from 'lodash-es/get';

const init = new Immutable.Map({authenticated: false});

function user(stateIn, action) {
  const state = stateIn || init;

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {user: userData, credential, additionalUserInfo} = action.payload;

      const profileData = get(userData, ['providerData', 0], userData);

      return state.merge({
        authenticated: true,
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
      });
    }

    case 'USER_LOGGED_OUT':
      return init;

    default:
      return state;
  }
}

export default user;
