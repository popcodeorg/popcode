import test from 'tape';
import Immutable from 'immutable';
import partial from 'lodash/partial';
import reducerTest from '../../helpers/reducerTest';
import {user as states} from '../../helpers/referenceStates';
import {userCredential} from '../../helpers/factory';
import reducer from '../../../src/reducers/user';
import {userAuthenticated, userLoggedOut} from '../../../src/actions/user';

const userCredentialIn = userCredential();

const loggedInState = Immutable.fromJS({
  authenticated: true,
  id: userCredentialIn.user.uid,
  displayName: userCredentialIn.user.providerData[0].displayName,
  avatarUrl: userCredentialIn.user.providerData[0].photoURL,
  accessTokens: {
    'github.com': userCredentialIn.credential.accessToken,
  },
});

test('userAuthenticated', reducerTest(
  reducer,
  states.initial,
  partial(userAuthenticated, userCredentialIn),
  loggedInState,
));

test('userLoggedOut', reducerTest(
  reducer,
  loggedInState,
  userLoggedOut,
  states.initial,
));
