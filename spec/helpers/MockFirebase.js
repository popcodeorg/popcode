/* global sinon */

import appFirebase from '../../src/services/appFirebase';
import merge from 'lodash/merge';

export function createUser(user) {
  return merge({
    github: {
      accessToken: 'abc123',
      displayName: 'Popcode User',
      profileImageURL: 'https://camo.github.com/popcodeuser.jpg',
      username: 'popcodeuser',
    },
    provider: 'github',
    uid: '123',
  }, user);
}

export default class MockFirebase {
  constructor(sandbox) {
    sandbox.stub(appFirebase);
  }

  logIn(uid) {
    this._userSpace = addChild(appFirebase, `workspaces/${uid}`);
    addChild(this._userSpace, 'currentProjectKey');
    addChild(this._userSpace, 'projects');
    appFirebase.onAuth.yields(createUser({uid}));
  }

  logOut() {
    this._userSpace = null;
    appFirebase.onAuth.yields(null);
  }

  setCurrentProject(currentProject) {
    if (currentProject === null) {
      yieldsValue(this._userSpace.child('currentProjectKey'), null);
      return;
    }

    const storedProjectKey =
      addChild(this._userSpace.child('projects'), currentProject.projectKey);

    yieldsValue(
      this._userSpace.child('currentProjectKey'),
      currentProject.projectKey
    );
    yieldsValue(storedProjectKey, currentProject);
  }
}

function addChild(firebaseKey, childName) {
  const childKey = {
    child: sinon.stub(),
    once: sinon.stub(),
  };
  firebaseKey.child.withArgs(childName).returns(childKey);
  return childKey;
}

function yieldsValue(firebaseKey, value) {
  firebaseKey.once.withArgs('value').callsArgWith(1, {val: () => value});
  return Promise.resolve(value);
}
