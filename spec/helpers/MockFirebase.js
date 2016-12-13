/* global sinon */

import get from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import setWith from 'lodash/setWith';
import {
  auth,
  database,
  githubAuthProvider,
} from '../../src/services/appFirebase';

export function createUser(user) {
  return merge({
    displayName: 'Popcode User',
    photoURL: 'https://camo.github.com/popcodeuser.jpg',
    providerData: [{
      displayName: 'Popcode User',
      email: 'popcodeuser@example.com',
      photoURL: 'https://camo.github.com/popcodeuser.jpg',
      providerId: 'github.com',
      uid: '345',
    }],
    uid: 'abc123',
  }, user);
}

export function createCredentials() {
  return {
    accessToken: '0123456789abcdef',
    provider: 'github.com',
  };
}

class MockRef {
  constructor(rootTree, path = []) {
    this._rootTree = rootTree;
    this._path = path;
    Object.assign(this, {
      set: sinon.mock(),
      setWithPriority: sinon.mock(),
    });
  }

  child(pathString) {
    return new MockRef(
      this._rootTree,
      this._path.concat(pathString.split('/'))
    );
  }

  once(event) {
    if (event === 'value') {
      return Promise.resolve({val: () => this._value});
    }
    return new Promise(noop);
  }

  get _value() {
    return get(this._rootTree, this._path);
  }
}

export default class MockFirebase {
  constructor(sandbox) {
    sandbox.stub(auth);
    sandbox.stub(githubAuthProvider);
    this._data = {};
    const rootRef = new MockRef(this._data);
    sandbox.stub(database, 'ref', (path) => rootRef.child(path));
    auth.onAuthStateChanged.returns(sinon.stub());
  }

  logIn(uid) {
    this._currentUid = uid;
    auth.onAuthStateChanged.yieldsAsync(createUser({uid}));
  }

  logOut() {
    this._currentUid = null;
    auth.onAuthStateChanged.yieldsAsync(null);
  }

  setCurrentProject(currentProject) {
    let workspace;
    if (currentProject === null) {
      workspace = {
        currentProjectKey: null,
        projects: {},
      };
    } else {
      workspace = {
        currentProjectKey: currentProject.projectKey,
        projects: {
          [currentProject.projectKey]: currentProject,
        },
      };
    }

    this._setValue(`workspaces/${this._currentUid}`, workspace);
  }

  _setValue(path, value) {
    setWith(this._data, path.split('/'), value, Object);
  }
}
