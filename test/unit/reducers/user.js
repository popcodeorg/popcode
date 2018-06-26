import test from 'tape';
import partial from 'lodash-es/partial';
import {Map} from 'immutable';

import reducerTest from '../../helpers/reducerTest';
import {user as states} from '../../helpers/referenceStates';
import {userCredential} from '../../helpers/factory';
import reducer from '../../../src/reducers/user';
import {userAuthenticated, userLoggedOut} from '../../../src/actions/user';
import {LoginState} from '../../../src/enums';
import {User, UserAccount} from '../../../src/records';

const userCredentialIn = userCredential();

const loggedOutState = new User({
  loginState: LoginState.ANONYMOUS,
});

const loggedInState = new User({
  loginState: LoginState.AUTHENTICATED,
  account: new UserAccount({
    id: userCredentialIn.user.uid,
    displayName: userCredentialIn.user.providerData[0].displayName,
    avatarUrl: userCredentialIn.user.providerData[0].photoURL,
    accessTokens: new Map({
      'github.com': userCredentialIn.credential.accessToken,
    }),
  }),
});

test('userAuthenticated', (t) => {
  t.test('with displayName', reducerTest(
    reducer,
    states.initial,
    partial(userAuthenticated, userCredentialIn),
    loggedInState,
  ));

  t.test('with no displayName', reducerTest(
    reducer,
    states.initial,
    partial(
      userAuthenticated,
      userCredential({user: {providerData: [{displayName: null}]}}),
    ),
    loggedInState.update(
      'account',
      account => account.set('displayName', 'popcoder'),
    ),
  ));
});

test('userLoggedOut', reducerTest(
  reducer,
  loggedInState,
  userLoggedOut,
  loggedOutState,
));
