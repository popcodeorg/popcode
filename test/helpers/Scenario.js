import reduce from '../../src/reducers';
import {projectCreated} from '../../src/actions/projects';
import {identityLinked, userAuthenticated} from '../../src/actions/user';
import Analyzer from '../../src/analyzers';

import {githubCredential, userCredential} from './factory';

export default class Scenario {
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
