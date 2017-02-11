/* eslint-env mocha */
/* global sinon */

import '../../helper';
import MockFirebase from '../../helpers/MockFirebase';
import {createUser} from '../../helpers/MockFirebase';
import {assert} from 'chai';
import dispatchAndWait from '../../helpers/dispatchAndWait';
import buildProject from '../../helpers/buildProject';
import createAndMutateProject from '../../helpers/createAndMutateProject';
import {getCurrentProject} from '../../../src/util/projectUtils';
import {bootstrap, logIn, logOut} from '../../../src/actions';
import createApplicationStore from '../../../src/createApplicationStore';

describe('user actions', () => {
  let store, sandbox, mockFirebase;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    mockFirebase = new MockFirebase(sandbox);
    store = createApplicationStore();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const userData = createUser();

  describe('logIn', () => {
    let storedProject, localProjectKey;

    beforeEach(() => {
      storedProject = buildProject({sources: {html: 'bogus<'}});
      mockFirebase.logOut();
      return dispatchAndWait(store, bootstrap());
    });

    context('with locally pristine project', () => {
      beforeEach(() => {
        localProjectKey = getCurrentProject(store.getState()).projectKey;
        mockFirebase.logIn(userData.uid);
      });

      context('with stored project', () => {
        beforeEach(() => {
          mockFirebase.setCurrentProject(storedProject);
          return dispatchAndWait(store, logIn(userData));
        });

        itShouldLogUserIn();

        it('should keep pristine project in scope', () => {
          assert.equal(
            getCurrentProject(store.getState()).projectKey,
            localProjectKey
          );
        });
      });

      context('without stored project', () => {
        beforeEach(() => {
          mockFirebase.setCurrentProject(null);
          return dispatchAndWait(store, logIn(userData));
        });

        itShouldLogUserIn();

        it('should keep pristine project in scope', () => {
          assert.equal(
            getCurrentProject(store.getState()).projectKey,
            localProjectKey
          );
        });
      });
    });

    context('with locally modified project', () => {
      beforeEach(() => {
        mockFirebase.logIn(userData.uid);
        createAndMutateProject(store);
        localProjectKey = getCurrentProject(store.getState()).projectKey;
      });

      context('with stored project', () => {
        beforeEach(() => {
          mockFirebase.setCurrentProject(storedProject);
          return dispatchAndWait(store, logIn(userData));
        });

        itShouldLogUserIn();

        it('should keep local project in scope', () => {
          assert.equal(
            getCurrentProject(store.getState()).projectKey,
            localProjectKey
          );
        });
      });
    });

    function itShouldLogUserIn() {
      it('should set user state to authenticated', () => {
        assert.isTrue(store.getState().getIn(['user', 'authenticated']));
      });

      it('should set user id to uid', () => {
        assert.equal(store.getState().getIn(['user', 'id']), userData.uid);
      });

      it('should set provider to github', () => {
        assert.equal(store.getState().getIn(['user', 'provider']), 'github');
      });

      it('should set display name', () => {
        assert.equal(
          store.getState().getIn(['user', 'displayName']),
          userData.github.displayName
        );
      });

      it('should set username', () => {
        assert.equal(
          store.getState().getIn(['user', 'username']),
          userData.github.username
        );
      });

      it('should set avatarUrl', () => {
        assert.equal(
          store.getState().getIn(['user', 'avatarUrl']),
          userData.github.profileImageURL
        );
      });

      it('should set auth token', () => {
        assert.equal(
          store.getState().getIn(['user', 'accessTokens', 'github']),
          userData.github.accessToken,
        );
      });
    }
  });

  describe('logOut', () => {
    let loggedInProjectKey;

    beforeEach(() => {
      mockFirebase.logIn(userData.uid);
      mockFirebase.setCurrentProject(null);
      return dispatchAndWait(store, bootstrap()).then(() => {
        createAndMutateProject(store);
        loggedInProjectKey = getCurrentProject(store.getState()).projectKey;
        return dispatchAndWait(store, logOut());
      });
    });

    it('should set authenticated to false', () => {
      assert.isFalse(store.getState().getIn(['user', 'authenticated']));
    });

    it('should set user id to null', () => {
      assert.isUndefined(store.getState().getIn(['user', 'id']));
    });

    it('should create a fresh project', () => {
      assert.notEqual(
        getCurrentProject(store.getState()).projectKey,
        loggedInProjectKey
      );
    });
  });
});
