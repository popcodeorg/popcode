import partial from 'lodash-es/partial';

import reduce from '../../src/reducers';
import {
  projectCreated,
} from '../../src/actions/projects';
import {
  userAuthenticated,
} from '../../src/actions/user';
import Analyzer from '../../src/analyzers';

import {userWithCredentials} from './factory';

export default class Scenario {
  constructor() {
    this.projectKey = '123456';
    this.state = reduce(undefined, projectCreated(this.projectKey));
  }

  logIn() {
    const {user, credentials} = this.userWithCredentials =
      userWithCredentials();
    this._reduce(partial(userAuthenticated, user, credentials));
    return this;
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

