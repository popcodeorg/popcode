import get from 'lodash-es/get';

import {User, UserAccount} from '../records';
import {LoginState} from '../enums';

function getToken(credential) {
  if (credential.providerId === 'github.com') {
    return credential.accessToken;
  } else if (credential.providerId === 'google.com') {
    return credential.idToken;
  }
  return null;
}

function user(stateIn, action) {
  const state = stateIn || new User();

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {user: userData, credential, additionalUserInfo} = action.payload;

      const profileData = get(userData, ['providerData', 0], userData);

      return state.merge({
        loginState: LoginState.AUTHENTICATED,
        account: new UserAccount({
          id: userData.uid,
          displayName: profileData.displayName || get(
            additionalUserInfo,
            'username',
          ),
          avatarUrl: profileData.photoURL,
        }).update(
          'accessTokens',
          accessTokens => accessTokens.set(
            credential.providerId,
            getToken(credential),
          ),
        ),
      });
    }

    case 'USER_LOGGED_OUT':
      return new User().set('loginState', LoginState.ANONYMOUS);

    default:
      return state;
  }
}

export default user;
