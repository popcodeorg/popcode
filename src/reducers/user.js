import reduce from 'lodash-es/reduce';

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

function addCredential(state, credential) {
  return state.updateIn(
    ['account', 'accessTokens'],
    accessTokens => accessTokens.set(
      credential.providerId,
      getToken(credential),
    ),
  );
}

function user(stateIn, action) {
  const state = stateIn || new User();

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {user: userData, credentials} = action.payload;

      return reduce(
        credentials,
        addCredential,
        state.merge({
          loginState: LoginState.AUTHENTICATED,
          account: new UserAccount({
            id: userData.uid,
            displayName: userData.displayName,
            avatarUrl: userData.photoURL,
          }),
        }),
      );
    }

    case 'IDENTITY_LINKED':
      return addCredential(state, action.payload.credential);

    case 'USER_LOGGED_OUT':
      return new User().set('loginState', LoginState.ANONYMOUS);

    default:
      return state;
  }
}

export default user;
