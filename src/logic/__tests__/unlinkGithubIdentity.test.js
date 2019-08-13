import unlinkGithubIdentity from '../unlinkGithubIdentity';

import {unlinkGithub} from '../../clients/firebase';

jest.mock('../../clients/firebase.js');

test('should unlink Github Identity', async () => {
  const {
    type,
    payload: {providerId},
  } = await unlinkGithubIdentity.process();
  expect(unlinkGithub).toHaveBeenCalledWith();
  expect(type).toBe('IDENTITY_UNLINKED');
  expect(providerId).toBe('github.com');
});
