import linkGithubIdentity from '../linkGithubIdentity';
import {linkGithub, saveCredentialForCurrentUser} from '../../clients/firebase';
import {getProfileForAuthenticatedUser} from '../../clients/github';
import {bugsnagClient} from '../../util/bugsnag';

import {
  credentialFactory,
  credentialInUseErrorFactory,
  firebaseErrorFactory,
  userFactory,
} from '@factories/clients/firebase';

import {githubProfileFactory} from '@factories/clients/github';

jest.mock('../../clients/firebase.js');
jest.mock('../../clients/github.js');
jest.mock('../../util/bugsnag.js');

describe('linkGithubIdentity', () => {
  test('success', async () => {
    const mockCredential = credentialFactory.build();
    const mockUser = userFactory.build();

    linkGithub.mockResolvedValue({
      user: mockUser,
      credential: mockCredential,
    });

    const {
      type,
      payload: {
        credential: {providerId},
        user,
      },
    } = await linkGithubIdentity.process();

    expect(linkGithub).toHaveBeenCalledWith();
    expect(saveCredentialForCurrentUser).toHaveBeenCalledWith(mockCredential);
    expect(type).toBe('IDENTITY_LINKED');
    expect(providerId).toBe(mockCredential.providerId);
    expect(user).toEqual(mockUser);
  });

  test('credential already in use', async () => {
    const error = credentialInUseErrorFactory.build();
    const githubProfile = githubProfileFactory.build();

    linkGithub.mockRejectedValue(error);
    getProfileForAuthenticatedUser.mockResolvedValue(githubProfile);

    const {
      type,
      payload: {
        credential: {providerId, accessToken},
      },
    } = await linkGithubIdentity.process();
    expect(linkGithub).toHaveBeenCalledWith();
    expect(getProfileForAuthenticatedUser).toHaveBeenCalledWith(
      error.credential.accessToken,
    );
    expect(type).toBe('ACCOUNT_MIGRATION_NEEDED');
    expect(providerId).toBe(error.credential.providerId);
    expect(accessToken).toBe(error.credential.accessToken);
  });

  test('other error', async () => {
    const otherError = firebaseErrorFactory.build();

    linkGithub.mockRejectedValue(otherError);
    bugsnagClient.notify.mockResolvedValue();

    const {
      type,
      error,
      payload: {message},
    } = await linkGithubIdentity.process();
    expect(linkGithub).toHaveBeenCalledWith();
    expect(bugsnagClient.notify).toHaveBeenCalledWith(otherError);
    expect(type).toBe('LINK_IDENTITY_FAILED');
    expect(error).toBe(true);
    expect(message).toBe(otherError.code);
  });
});
