import linkGithubIdentity from '../linkGithubIdentity';
import {linkGithub, saveCredentialForCurrentUser} from '../../clients/firebase';
import {getProfileForAuthenticatedUser} from '../../clients/github';
import {bugsnagClient} from '../../util/bugsnag';

import {
  accountMigrationNeeded,
  linkIdentityFailed,
  identityLinked,
} from '../../actions/user';

import {processLogic} from './helpers';

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

    const dispatch = await processLogic(linkGithubIdentity);
    expect(dispatch).toHaveBeenCalledWith(
      identityLinked(mockUser, mockCredential),
    );

    expect(linkGithub).toHaveBeenCalledWith();
    expect(saveCredentialForCurrentUser).toHaveBeenCalledWith(mockCredential);
  });

  test('credential already in use', async () => {
    const error = credentialInUseErrorFactory.build();
    const githubProfile = githubProfileFactory.build();

    linkGithub.mockRejectedValue(error);
    getProfileForAuthenticatedUser.mockResolvedValue({data: githubProfile});

    const dispatch = await processLogic(linkGithubIdentity);

    expect(linkGithub).toHaveBeenCalledWith();
    expect(getProfileForAuthenticatedUser).toHaveBeenCalledWith(
      error.credential.accessToken,
    );
    expect(dispatch).toHaveBeenCalledWith(
      accountMigrationNeeded(githubProfile, error.credential),
    );
  });

  test('other error', async () => {
    const otherError = firebaseErrorFactory.build();

    linkGithub.mockRejectedValue(otherError);
    bugsnagClient.notify.mockResolvedValue();

    const dispatch = await processLogic(linkGithubIdentity);
    expect(linkGithub).toHaveBeenCalledWith();
    expect(bugsnagClient.notify).toHaveBeenCalledWith(otherError);
    expect(dispatch).toHaveBeenCalledWith(linkIdentityFailed(otherError));
  });
});
