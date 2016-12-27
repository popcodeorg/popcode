import Immutable from 'immutable';

const init = new Immutable.Map({authenticated: false});

function user(stateIn, action) {
  const state = stateIn || init;

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {user: userData, credential} = action.payload;

      return state.merge({
        authenticated: true,
        id: userData.uid,
        displayName: userData.displayName,
        avatarUrl: userData.photoURL,
        accessTokens: new Immutable.Map().set(
          credential.provider,
          credential.accessToken
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
