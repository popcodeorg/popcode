import unlinkGithubIdentity from '../unlinkGithubIdentity';

import {unlinkGithub} from '../../clients/firebase';

jest.mock('../../clients/firebase.js');

test('should unlink Github Identity', async() => {
  const action = await unlinkGithubIdentity.process();
  expect(unlinkGithub).toHaveBeenCalledWith();
  expect(action).not.toBeNull();
  expect(action.type).toBe('IDENTITY_UNLINKED');
  const {payload} = action;
  expect(payload).not.toBeNull();
  expect(payload.providerId).toBe('github.com');
});
