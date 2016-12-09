/* eslint-env mocha */
/* global sinon */

import '../../helper';
import MockFirebase from '../../helpers/MockFirebase';
import {assert} from 'chai';
import dispatchAndWait from '../../helpers/dispatchAndWait';
import buildProject from '../../helpers/buildProject';
import createAndMutateProject from '../../helpers/createAndMutateProject';
import {getCurrentProject} from '../../../src/util/projectUtils';
import {bootstrap, logIn} from '../../../src/actions';
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

  describe('logIn', () => {
    const userData = {
      auth: {uid: '123', provider: 'github'},
      github: {
        accessToken: 'abc123',
        displayName: 'Popcode User',
        profileImageURL: 'https://camo.github.com/popcodeuser.jpg',
        username: 'popcodeuser',
      },
      provider: 'github',
    };

    let storedProject;

    beforeEach(() => {
      storedProject = buildProject({sources: {html: 'bogus<'}});
      mockFirebase.logOut();
      return dispatchAndWait(store, bootstrap());
    });

    context('with locally pristine project', () => {
      beforeEach(() => {
        mockFirebase.logIn(userData.auth.uid);
      });

      context('with stored project', () => {
        beforeEach(() => {
          mockFirebase.setCurrentProject(storedProject);
          return dispatchAndWait(store, logIn(userData));
        });

        itShouldLogUserIn();

        it('should set project to stored project', () => {
          assert.equal(
            getCurrentProject(store.getState()).projectKey,
            storedProject.projectKey
          );
        });
      });

      context('without stored project', () => {
        beforeEach(() => {
          mockFirebase.setCurrentProject(null);
          return dispatchAndWait(store, logIn(userData));
        });

        it('should create fresh project', () => {
          assert.isNotNull(getCurrentProject(store.getState()).projectKey);
        });
      });
    });

    context('with locally modified project', () => {
      let localProjectKey;

      beforeEach(() => {
        mockFirebase.logIn(userData.auth.uid);
        createAndMutateProject(store);
        localProjectKey = getCurrentProject(store.getState()).projectKey;
      });

      context('with stored project', () => {
        beforeEach(() => {
          mockFirebase.setCurrentProject(storedProject);
          return dispatchAndWait(store, logIn(userData));
        });

        itShouldLogUserIn();

        it('should set project to stored project', () => {
          assert.equal(
            getCurrentProject(store.getState()).projectKey,
            localProjectKey
          );
        });
      });
    });

    function itShouldLogUserIn() {
      it('should set user state to authenticated', () => {
        assert.isTrue(store.getState().user.get('authenticated'));
      });

      it('should set user id to uid', () => {
        assert.equal(store.getState().user.get('id'), userData.auth.uid);
      });

      it('should set provider to github', () => {
        assert.equal(store.getState().user.get('provider'), 'github');
      });

      it('should set display name', () => {
        assert.equal(
          store.getState().user.getIn(['info', 'displayName']),
          userData.github.displayName
        );
      });

      it('should set username', () => {
        assert.equal(
          store.getState().user.getIn(['info', 'username']),
          userData.github.username
        );
      });

      it('should set imageURL', () => {
        assert.equal(
          store.getState().user.getIn(['info', 'imageURL']),
          userData.github.imageURL
        );
      });

      it('should set auth token', () => {
        assert.equal(
          store.getState().user.getIn(['info', 'accessToken']),
          userData.github.accessToken,
        );
      });
    }
  });
});
