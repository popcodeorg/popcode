import logout from '../logout';

import {signOut} from '../../clients/firebase';

jest.mock('../../clients/firebase.js');

test('logOut', async () => {
  await logout.process();
  expect(signOut).toHaveBeenCalledWith();
});
