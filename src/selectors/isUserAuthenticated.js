import {LoginState} from '../enums';

export default function isUserAuthenticated(state) {
  return state.getIn(['user', 'loginState']) === LoginState.AUTHENTICATED;
}
