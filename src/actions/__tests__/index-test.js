/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('..');

var Immutable = require('immutable');

var project = require('../../__test__/blankProject');

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
    var Storage = require('../../services/Storage');

    beforeEach(function() {
      var loadCurrentProjectFromStorageFn =
        Actions.loadCurrentProjectFromStorage();

      Storage.getCurrentProjectKey.mockReturnValue(
        Promise.resolve(project.projectKey)
      );
      Storage.load.mockReturnValue(Promise.resolve(project));
      loadCurrentProjectFromStorageFn(dispatch);

      this.actionDispatched = new Promise(dispatch.mockImplementation).
        then(function() {
          return dispatch.mock.calls[0][0];
        });
    });

    pit('should dispatch CURRENT_PROJECT_LOADED_FROM_STORAGE', function() {
      return this.actionDispatched.then(function(action) {
        expect(action.type).toBe('CURRENT_PROJECT_LOADED_FROM_STORAGE');
      });
    });

    pit('should pass project in payload', function() {
      return this.actionDispatched.then(function(action) {
        expect(action.payload.project).toBe(project);
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

  describe('updateProjectSource', function() {
    var Storage = require('../../services/Storage');

    beforeEach(function() {
      Storage.save.mockClear();

      var updateProjectSourceFn = Actions.updateProjectSource(
        '12345',
        'css',
        'p { display: none; }'
      );

      var getState = jest.genMockFunction();
      getState.mockReturnValue({
        currentProject: new Immutable.Map({projectKey: '12345'}),
        projects: Immutable.fromJS({12345: project}),
      });

      updateProjectSourceFn(dispatch, getState);

      this.actionDispatched = dispatch.mock.calls[0][0];
    });

    it('should dispatch PROJECT_SOURCE_EDITED', function() {
      expect(this.actionDispatched.type).toBe('PROJECT_SOURCE_EDITED');
    });

    it('should include projectKey in payload', function() {
      expect(this.actionDispatched.payload.projectKey).toBe('12345');
    });

    it('should include language in payload', function() {
      expect(this.actionDispatched.payload.language).toBe('css');
    });

    it('should include newValue in payload', function() {
      expect(this.actionDispatched.payload.newValue).
        toBe('p { display: none; }');
    });

    it('should save project', function() {
      expect(Storage.save.mock.calls).toEqual([
        [project],
      ]);
    });
  });
});
