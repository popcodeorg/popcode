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
import {setSessionUid} from '../../src/clients/firebaseAuth';

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

export function createCredential() {
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
    auth.signOut.returns(Promise.resolve());
  }

  logIn(uid) {
    const user = createUser({uid});
    const credential = createCredential();
    this._currentUid = uid;
    this.setCurrentUserCredential();
    Reflect.defineProperty(auth, 'currentUser', {value: user});
    auth.onAuthStateChanged.yieldsAsync(user);
    setSessionUid();
    return {user, credential};
  }

  logOut() {
    this._currentUid = null;
    auth.onAuthStateChanged.yieldsAsync(null);
    Reflect.defineProperty(auth, 'currentUser', {value: null});
  }

  setCurrentUserCredential(credential = createCredential()) {
    this._setValue(`authTokens/${this._currentUid}/github_com`, credential);
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
