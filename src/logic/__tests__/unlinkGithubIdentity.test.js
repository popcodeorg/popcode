import unlinkGithubIdentity from '../unlinkGithubIdentity';

import {unlinkGithub} from '../../clients/firebase';
import {identityUnlinked} from '../../actions/user';

import {processLogic} from './helpers';

jest.mock('../../clients/firebase');

test('should unlink Github Identity', async () => {
  const dispatch = await processLogic(unlinkGithubIdentity);
  expect(unlinkGithub).toHaveBeenCalledWith();
  expect(dispatch).toHaveBeenCalledWith(identityUnlinked('github.com'));
});
