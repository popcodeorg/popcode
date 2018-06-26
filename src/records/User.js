import {Record} from 'immutable';

import {LoginState} from '../enums';

export default Record({
  loginState: LoginState.UNKNOWN,
  account: null,
}, 'User');
