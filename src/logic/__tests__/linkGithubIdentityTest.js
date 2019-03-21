import linkGithubIdentity from '../linkGithubIdentity';

import {
  linkGithub,
  saveCredentialForCurrentUser,
} from '../../clients/firebase';

jest.mock('../../clients/firebase.js');

test('success', async() => {
  const mockCredential = {providerId: 'github.com'};
  linkGithub.mockResolvedValue({
    user: {},
    credential: mockCredential,
  });
  const {type, payload: {credential: {
    providerId,
  }, user}} = await linkGithubIdentity.process();
  expect(linkGithub).toHaveBeenCalledWith();
  expect(saveCredentialForCurrentUser).toHaveBeenCalledWith(mockCredential);
  expect(type).toBe('IDENTITY_LINKED');
  expect(providerId).toBe(mockCredential.providerId);
  expect(user).toEqual({});
});

// TODO: Add test for experimental mode

// TODO: Add test for other error
