import linkGithubIdentity from '../linkGithubIdentity';

import {
  linkGithub,
  saveCredentialForCurrentUser,
} from '../../clients/firebase';
import {getProfileForAuthenticatedUser} from '../../clients/github';
import {bugsnagClient} from '../../util/bugsnag';

jest.mock('../../clients/firebase.js');
jest.mock('../../clients/github.js');
jest.mock('../../util/bugsnag.js');

describe('linkGithubIdentity', () => {
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

  test('credential already in use in experimental mode', async() => {
    const error = new Error('credential already in use');
    error.code = 'auth/credential-already-in-use';
    error.credential = {providerId: 'github.com', accessToken: 'abc123'};

    const githubProfile = {login: 'popcoder'};

    linkGithub.mockRejectedValue(error);
    getProfileForAuthenticatedUser.mockResolvedValue(githubProfile);

    const {type, payload: {credential: {
      providerId, accessToken,
    }}} = await linkGithubIdentity.process();
    expect(linkGithub).toHaveBeenCalledWith();
    expect(getProfileForAuthenticatedUser).toHaveBeenLastCalledWith(
      error.credential.accessToken,
    );
    expect(type).toBe('ACCOUNT_MIGRATION_NEEDED');
    expect(providerId).toBe('github.com');
    expect(accessToken).toBe('abc123');
  });

  test('other error', async() => {
    const errorMessage = 'authentication problem!';
    const otherError = new Error(errorMessage);

    linkGithub.mockRejectedValue(otherError);
    bugsnagClient.notify.mockResolvedValue(null);

    const {type, error, payload: {
      message,
    }} = await linkGithubIdentity.process();
    expect(linkGithub).toHaveBeenCalledWith();
    expect(bugsnagClient.notify).toHaveBeenCalledWith(otherError);
    expect(type).toBe('LINK_IDENTITY_FAILED');
    expect(error).toBe(true);
    expect(message).toBe(errorMessage);
  });
});
