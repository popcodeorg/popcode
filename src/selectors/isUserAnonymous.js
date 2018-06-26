import {LoginState} from '../enums';

export default function isUserAnonymous(state) {
  return state.getIn(['user', 'loginState']) === LoginState.ANONYMOUS;
}
