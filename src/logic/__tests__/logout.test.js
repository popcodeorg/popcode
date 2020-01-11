import {logOut as logOutAction} from '../../actions/user';

import {signOut} from '../../clients/firebase';
import logout from '../logout';

import {makeTestLogic} from './helpers';

jest.mock('../../clients/firebase.js');

describe('logout', () => {
  const testLogic = makeTestLogic(logout);

  test('calls sign out', async () => {
    await testLogic(logOutAction());
    expect(signOut).toHaveBeenCalledWith();
  });
});
