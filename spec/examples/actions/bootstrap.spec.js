/* eslint-env mocha */
/* global sinon */

import '../../helper';
import {assert} from 'chai';
import property from 'lodash/property';
import {bootstrap} from '../../../src/actions';
import MockFirebase from '../../helpers/MockFirebase';
import MockGitHub from '../../helpers/MockGitHub';
import buildProject from '../../helpers/buildProject';
import buildGist from '../../helpers/buildGist';
import waitForAsync from '../../helpers/waitForAsync';
import {getCurrentProject} from '../../../src/util/projectUtils';
import createApplicationStore from '../../../src/createApplicationStore';

describe('bootstrap', () => {
  let store, sandbox, mockFirebase, mockGitHub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    mockFirebase = new MockFirebase(sandbox);
    mockGitHub = new MockGitHub(sandbox);
    store = createApplicationStore();
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('no gist ID', () => {
    context('before auth resolves', () => {
      beforeEach(() => dispatchBootstrap());

      it('should have no current project by default', () => {
        assert.isNull(
          store.getState().getIn(['currentProject', 'projectKey'])
        );
      });
    });

    context('when auth resolves logged out', () => {
      beforeEach(() => {
        mockFirebase.logOut();
        return dispatchBootstrap();
      });

      it('should create a new current project', () => {
        assert.isNotNull(
          store.getState().getIn(['currentProject', 'projectKey'])
        );
      });

      it('should set user to logged out', () => {
        assert.isNotTrue(store.getState().getIn(['user', 'authenticated']));
      });
    });

    context('when auth resolves logged in', () => {
      const uid = '123';

      context('no current project in Firebase', () => {
        beforeEach(() => {
          mockFirebase.logIn(uid);
          mockFirebase.setCurrentProject(null);
          return dispatchBootstrap();
        });

        it('should log the user in', () => {
          assert.isTrue(store.getState().getIn(['user', 'authenticated']));
        });

        it('should create a new current project', () =>
          assert.eventually.isNotNull(Promise.resolve().then(() =>
            store.getState().getIn(['currentProject', 'projectKey']))
          )
        );
      });

      context('current project in Firebase', () => {
        let project;

        beforeEach(() => {
          project = buildProject({sources: {html: 'bogus<'}});
          mockFirebase.logIn(uid);
          mockFirebase.setCurrentProject(project);
          return dispatchBootstrap();
        });

        it('should create a new current project', () => {
          assert.notEqual(
            store.getState().getIn(['currentProject', 'projectKey']),
            project.projectKey
          );
        });
      });
    });
  });

  context('with gist ID', () => {
    const gistId = '12345';

    context('before auth or gist resolve', () => {
      beforeEach(() => dispatchBootstrap(gistId));

      it('should have no current project', () => {
        assert.isNull(
          store.getState().getIn(['currentProject', 'projectKey'])
        );
      });
    });

    context('if only auth has resolved', () => {
      beforeEach(() => {
        mockFirebase.logOut();
        return dispatchBootstrap(gistId);
      });

      it('should have no current project', () => {
        assert.isNull(
          store.getState().getIn(['currentProject', 'projectKey'])
        );
      });
    });

    context('if only gist has resolved', () => {
      beforeEach(() => {
        mockGitHub.loadGist(buildGist(gistId));
        return dispatchBootstrap(gistId);
      });

      it('should have no current project', () => {
        assert.isNull(
          store.getState().getIn(['currentProject', 'projectKey'])
        );
      });
    });

    context('with gist resolved', () => {
      const javascript = '// imported from Gist';

      beforeEach(() => {
        mockGitHub.loadGist(buildGist(gistId, {sources: {javascript}}));
      });

      context('with logged out user', () => {
        beforeEach(() => {
          mockFirebase.logOut();
          return dispatchBootstrap(gistId);
        });

        it('should have a current project', () => {
          assert.isNotNull(
            store.getState().getIn(['currentProject', 'projectKey'])
          );
        });

        it('should use the gist data in the current project', () => {
          assert.equal(
            getCurrentProject(store.getState()).sources.javascript,
            javascript
          );
        });
      });

      context('with logged in user and current project', () => {
        beforeEach(() => {
          mockFirebase.logIn('123');
          mockFirebase.setCurrentProject(buildProject());
          return dispatchBootstrap(gistId);
        });

        it('should have a current project', () => {
          assert.isNotNull(
            store.getState().getIn(['currentProject', 'projectKey'])
          );
        });

        it('should use the gist data in the current project', () => {
          assert.equal(
            getCurrentProject(store.getState()).sources.javascript,
            javascript
          );
        });
      });
    });

    describe('gist scenarios', () => {
      context('no enabled libraries', () => {
        beforeEach(() => {
          const gist = buildGist(gistId);
          Reflect.deleteProperty(gist.files, 'popcode.json');
          mockGitHub.loadGist(gist);
          mockFirebase.logOut();
          return dispatchBootstrap(gistId);
        });

        it('should add empty libraries by default', () => {
          assert.deepEqual(
            getCurrentProject(store.getState()).enabledLibraries,
            []
          );
        });
      });

      context('enabled libraries', () => {
        beforeEach(() => {
          const gist = buildGist(gistId, {enabledLibraries: ['jquery']});
          mockGitHub.loadGist(gist);
          mockFirebase.logOut();
          return dispatchBootstrap(gistId);
        });

        it('should load libraries into project', () => {
          assert.include(
            getCurrentProject(store.getState()).enabledLibraries,
            'jquery'
          );
        });
      });

      context('not found', () => {
        beforeEach(() => {
          mockFirebase.logOut();
          mockGitHub.gistNotFound(gistId);
          return dispatchBootstrap(gistId);
        });

        it('should create a new project', () => {
          assert.isNotNull(
            store.getState().getIn(['currentProject', 'projectKey'])
          );
        });

        it('should add a notification', () => {
          assert.include(
            store.getState().getIn(['ui', 'notifications']).toJS().
            map(property('type')),
            'gist-import-not-found'
          );
        });
      });

      context('import error', () => {
        beforeEach(() => {
          mockFirebase.logOut();
          mockGitHub.gistError(gistId);
          return dispatchBootstrap(gistId);
        });

        it('should create a new project', () => {
          assert.isNotNull(
            store.getState().getIn(['currentProject', 'projectKey'])
          );
        });

        it('should add a notification', () => {
          assert.include(
            store.getState().getIn(['ui', 'notifications']).toJS().
            map(property('type')),
            'gist-import-error'
          );
        });
      });
    });
  });

  function dispatchBootstrap(gistId) {
    store.dispatch(bootstrap(gistId));
    return waitForAsync();
  }
});
