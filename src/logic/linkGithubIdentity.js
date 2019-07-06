import {createLogic} from 'redux-logic';

import {linkGithub, saveCredentialForCurrentUser} from '../clients/firebase';
import {
  accountMigrationNeeded,
  identityLinked,
  linkIdentityFailed,
} from '../actions/user';
import {getProfileForAuthenticatedUser} from '../clients/github';
import {bugsnagClient} from '../util/bugsnag';

export default createLogic({
  type: 'LINK_GITHUB_IDENTITY',
  async process() {
    try {
      const {user: userData, credential} = await linkGithub();
      await saveCredentialForCurrentUser(credential);
      return identityLinked(userData, credential);
    } catch (e) {
      if (e.code === 'auth/credential-already-in-use') {
        const {data: githubProfile} = await getProfileForAuthenticatedUser(
          e.credential.accessToken,
        );
        return accountMigrationNeeded(githubProfile, e.credential);
      }
      await bugsnagClient.notify(e);
      return linkIdentityFailed(e);
    }
  },
});
