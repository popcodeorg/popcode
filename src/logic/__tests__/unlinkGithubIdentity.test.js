import unlinkGithubIdentity from '../unlinkGithubIdentity';

import {
  unlinkGithubIdentity as unlinkGithubIdentityAction,
  identityUnlinked,
} from '../../actions/user';

import {unlinkGithub} from '../../clients/firebase';

import {makeTestLogic} from './helpers';

jest.mock('../../clients/firebase');

describe('unlinkGithubIdentity', () => {
  const testLogic = makeTestLogic(unlinkGithubIdentity);

  test('should unlink Github Identity', async () => {
    const dispatch = await testLogic(unlinkGithubIdentityAction());
    expect(unlinkGithub).toHaveBeenCalledWith();
    expect(dispatch).toHaveBeenCalledWith(identityUnlinked('github.com'));
  });
});
