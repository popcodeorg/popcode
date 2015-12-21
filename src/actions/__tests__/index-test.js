/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('..');

describe('errors', function() {
  var Actions = require('..');
  var dispatch;

  beforeEach(function() {
    dispatch = jest.genMockFunction();
  });

  describe('createProject', function() {
    beforeEach(function() {
      var createProjectFn = Actions.createProject();
      createProjectFn(dispatch);
      this.dispatchedAction = dispatch.mock.calls[0][0];
    });

    it('should dispatch one action', function() {
      expect(dispatch.mock.calls.length).toBe(1);
    });

    it('should dispatch PROJECT_CREATED action', function() {
      expect(this.dispatchedAction.type).toBe('PROJECT_CREATED');
    });

    it('should add a project key', function() {
      expect(this.dispatchedAction.payload.projectKey).toBeDefined();
    });
  });

  describe('loadCurrentProjectFromStorage with project', function() {
    var project = {
      projectKey: '12345',
      sources: {html: '', css: '', javascript: ''},
      libraries: [],
    };

    var Storage = require('../../services/Storage');

    beforeEach(function() {
      var loadCurrentProjectFromStorageFn =
        Actions.loadCurrentProjectFromStorage();

      Storage.getCurrentProjectKey.mockReturnValue(
        Promise.resolve(project.projectKey)
      );
      Storage.load.mockReturnValue(Promise.resolve(project));
      loadCurrentProjectFromStorageFn(dispatch);

      this.actionsDispatched = new Promise(dispatch.mockImplementation).
        then(function() {
          return {
            projectLoaded: dispatch.mock.calls[0][0],
            currentProjectChanged: dispatch.mock.calls[1][0],
          };
        });
    });

    pit('should dispatch PROJECT_LOADED_FROM_STORAGE', function() {
      return this.actionsDispatched.then(function(actions) {
        expect(actions.projectLoaded.type).
          toBe('PROJECT_LOADED_FROM_STORAGE');
      });
    });

    pit('should pass project to PROJECT_LOADED_FROM_STORAGE', function() {
      return this.actionsDispatched.then(function(actions) {
        expect(actions.projectLoaded.payload.project).toBe(project);
      });
    });

    pit('should dispatch CURRENT_PROJECT_CHANGED', function() {
      return this.actionsDispatched.then(function(actions) {
        expect(actions.currentProjectChanged.type).
          toBe('CURRENT_PROJECT_CHANGED');
      });
    });

    pit('should dispatch CURRENT_PROJECT_CHANGED', function() {
      return this.actionsDispatched.then(function(actions) {
        expect(actions.currentProjectChanged.payload.projectKey).
          toBe(project.projectKey);
      });
    });
  });

  describe('loadCurrentProjectFromStorage with no project', function() {
    var Storage = require('../../services/Storage');

    beforeEach(function() {
      var loadCurrentProjectFromStorageFn =
        Actions.loadCurrentProjectFromStorage();

      Storage.getCurrentProjectKey.mockReturnValue(Promise.resolve(undefined));
      loadCurrentProjectFromStorageFn(dispatch);

      this.actionsDispatched = new Promise(dispatch.mockImplementation).
        then(function() {
          return dispatch.mock.calls[0][0];
        });
    });

    pit('should dispatch PROJECT_CREATED action', function() {
      return this.actionsDispatched.then(function(action) {
        expect(action.type).toBe('PROJECT_CREATED');
      });
    });
  });
});
