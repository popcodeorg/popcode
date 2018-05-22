import Immutable from 'immutable';
import get from 'lodash-es/get';

const init = new Immutable.Map({authenticated: false});

function getToken(credential) {
  if (credential.providerId === 'github.com') {
    return credential.accessToken;
  } else if (credential.providerId === 'google.com') {
    return credential.idToken;
  }
  return null;
}

function user(stateIn, action) {
  const state = stateIn || init;

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {user: userData, credential, additionalUserInfo} = action.payload;

      const profileData = get(userData, ['providerData', 0], userData);
      const githubUsername = get(additionalUserInfo, 'username');

      return state.merge({
        authenticated: true,
        id: userData.uid,
        displayName: profileData.displayName || githubUsername,
        avatarUrl: profileData.photoURL,
        accessTokens: new Immutable.Map().set(
          credential.providerId,
          getToken(credential),
        ),
        githubUsername,
      });
    }

    case 'USER_LOGGED_OUT':
      return init;

    default:
      return state;
  }
}

export default user;
