import AuthenticationStates from '../enums/AuthenticationStates';

export default function isUserAuthenticated(state) {
  return state.getIn(['user', 'authenticationState']) ===
    AuthenticationStates.AUTHENTICATED;
}
