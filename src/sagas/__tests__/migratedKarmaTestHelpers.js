import {projectCreated} from '../../actions/projects';
import {identityLinked, userAuthenticated} from '../../actions/user';
import Analyzer from '../../analyzers';
import reduce from '../../reducers';

import {
  credentialFactory,
  userFactory,
} from '../../../__factories__/clients/firebase';

function userCredential() {
  return {
    user: userFactory.build(),
    credential: credentialFactory.build({providerId: 'google.com'}),
  };
}

function githubCredential() {
  return credentialFactory.build({providerId: 'github.com'});
}

// eslint-disable-next-line camelcase
export class deprecated_Scenario {
  constructor() {
    this.projectKey = '123456';
    this.state = reduce(undefined, projectCreated(this.projectKey));
  }

  logIn() {
    const {user, credential} = userCredential();
    this._reduce(userAuthenticated(user, [credential]));
    return this;
  }

  authGitHub() {
    const credential = githubCredential();
    this._reduce(
      identityLinked(
        {
          providerData: [
            {
              providerId: 'github.com',
              displayName: 'popcode user',
              avatarURL: 'https://github.com/popcode.jpg',
            },
          ],
        },
        credential,
      ),
    );
    return credential;
  }

  get project() {
    return this.state.getIn(['projects', this.projectKey]);
  }

  get user() {
    return this.state.get('user');
  }

  get analyzer() {
    return new Analyzer(this.project.toJS());
  }

  _reduce(action) {
    this.state = reduce(this.state, action);
  }
}
