import logout from '../logout';

import {signOut} from '../../clients/firebase';

import {processLogic} from './helpers';

jest.mock('../../clients/firebase.js');

test('logOut', async () => {
  await processLogic(logout);
  expect(signOut).toHaveBeenCalledWith();
});
