import Immutable from 'immutable';

const init = new Immutable.Map({authenticated: false});

function user(stateIn, action) {
  const state = stateIn || init;

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const payload = action.payload;

      return state.merge({
        authenticated: true,
        id: payload.auth.uid,
        provider: payload.auth.provider,
        info: Immutable.fromJS(payload.github),
      });
    }

    case 'USER_LOGGED_OUT':
      return init;

    default:
      return state;
  }
}

export default user;
