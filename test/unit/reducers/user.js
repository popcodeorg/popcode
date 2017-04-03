import test from 'tape';
import Immutable from 'immutable';
import partial from 'lodash/partial';
import reducerTest from '../../helpers/reducerTest';
import {user as states} from '../../helpers/referenceStates';
import {userCredential} from '../../helpers/factory';
import reducer from '../../../src/reducers/user';
import {userAuthenticated} from '../../../src/actions/user';

const userCredentialIn = userCredential();

test('userAuthenticated', reducerTest(
  reducer,
  states.initial,
  partial(userAuthenticated, userCredentialIn),
  Immutable.fromJS({
    authenticated: true,
    id: userCredentialIn.user.uid,
    displayName: userCredentialIn.user.providerData[0].displayName,
    avatarUrl: userCredentialIn.user.providerData[0].photoURL,
    accessTokens: {
      'github.com': userCredentialIn.credential.accessToken,
    },
  }),
));
