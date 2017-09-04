import AuthenticationStates from '../enums/AuthenticationStates';

export default function isUserConfirmed(state) {
  return state.getIn(['user', 'authenticationState']) ===
    AuthenticationStates.CONFIRMED;
}
