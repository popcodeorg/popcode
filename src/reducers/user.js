import Immutable from 'immutable';

const init = new Immutable.Map({authenticated: false});

function user(stateIn, action) {
  const state = stateIn || init;

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {userData} = action.payload;
      const provider = userData.provider;
      const profile = userData[provider];

      return state.merge({
        authenticated: true,
        provider,
        id: userData.uid,
        displayName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.profileImageURL,
        accessTokens: new Immutable.Map({
          [provider]: profile.accessToken,
        }),
      });
    }

    case 'USER_LOGGED_OUT':
      return init;

    default:
      return state;
  }
}

export default user;
