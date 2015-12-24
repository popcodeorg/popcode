/* eslint-env jest */
/* eslint global-require: 0 */

var lodash = require('lodash');

var blank = require.requireActual('../../__test__/blank');

describe('index', function() {
  var validations = {
    html: jest.genMockFn(),
    css: jest.genMockFn(),
    javascript: jest.genMockFn(),
  };
  jest.setMock('../../validations', validations);

  var Actions = require.requireActual('../index');
  var Storage = require('../../services/Storage');
  var dispatch, getState;

  function dispatchThunkAction(action) {
    action(dispatch, getState);
  }

  beforeEach(function() {
    dispatch = jest.genMockFunction();
    getState = jest.genMockFunction();
  });

  afterEach(function() {
    Storage.setCurrentProjectKey.mockClear();
    Storage.save.mockClear();
  });

  describe('createProject', function() {
    beforeEach(function() {
      getState.mockReturnValue(blank.state);

      dispatchThunkAction(Actions.createProject());
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

    it('should save current project key', function() {
      expect(Storage.setCurrentProjectKey.mock.calls).
        toEqual([['12345']]);
    });

    it('should save new project', function() {
      expect(Storage.save.mock.calls).
        toEqual([
          [blank.project],
        ]);
    });
  });

  describe('loadCurrentProjectFromStorage with project', function() {
    beforeEach(function() {
      Storage.getCurrentProjectKey.mockReturnValue(
        Promise.resolve(blank.project.projectKey)
      );
      Storage.load.mockReturnValue(Promise.resolve(blank.project));

      dispatchThunkAction(Actions.loadCurrentProjectFromStorage());

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
        expect(action.payload.project).toBe(blank.project);
      });
    });
  });

  describe('loadCurrentProjectFromStorage with no project', function() {
    beforeEach(function() {
      Storage.getCurrentProjectKey.mockReturnValue(Promise.resolve(undefined));
      dispatchThunkAction(Actions.loadCurrentProjectFromStorage());

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
    beforeEach(function() {
      getState.mockReturnValue(blank.state);

      this.promisedValidatedSourceAction = new Promise(function(resolve) {
        dispatch.mockImplementation(function(action) {
          if (action.type === 'VALIDATED_SOURCE') {
            resolve(action);
          }
        });
      });

      this.error = {
        row: 1, column: 1,
        raw: 'bad css',
        text: 'bad css',
        type: 'error',
      };

      validations.css.mockReturnValue(Promise.resolve([this.error]));

      dispatchThunkAction(Actions.updateProjectSource(
        '12345',
        'css',
        'p { display: none; }'
      ));

      this.actionsDispatched = lodash(dispatch.mock.calls).
        map(0).indexBy('type').value();
    });

    it('should dispatch PROJECT_SOURCE_EDITED', function() {
      expect(this.actionsDispatched.PROJECT_SOURCE_EDITED).toBeDefined();
    });

    it('should include projectKey in payload', function() {
      expect(this.actionsDispatched.PROJECT_SOURCE_EDITED.payload.projectKey).
        toBe('12345');
    });

    it('should include language in payload', function() {
      expect(this.actionsDispatched.PROJECT_SOURCE_EDITED.payload.language).
        toBe('css');
    });

    it('should include newValue in payload', function() {
      expect(this.actionsDispatched.PROJECT_SOURCE_EDITED.payload.newValue).
        toBe('p { display: none; }');
    });

    it('should dispatch validation starting action', function() {
      expect(this.actionsDispatched.VALIDATING_SOURCE).toBeDefined();
    });

    pit('should dispatch validation complete action', function() {
      return this.promisedValidatedSourceAction.then(function(action) {
        expect(action).toBeDefined();
      });
    });

    pit('should send errors in validation complete action', function() {
      return this.promisedValidatedSourceAction.then(function(action) {
        expect(action.payload.errors).toEqual([this.error]);
      }.bind(this));
    });

    it('should save project', function() {
      expect(Storage.save.mock.calls).toEqual([
        [blank.project],
      ]);
    });
  });

  describe('changeCurrentProject', function() {
    beforeEach(function() {
      dispatchThunkAction(Actions.changeCurrentProject('12345'));

      this.actionDispatched = dispatch.mock.calls[0][0];
    });

    it('should dispatch CURRENT_PROJECT_CHANGED', function() {
      expect(this.actionDispatched.type).toBe('CURRENT_PROJECT_CHANGED');
    });

    it('should dispatch project key in the payload', function() {
      expect(this.actionDispatched.payload.projectKey).toBe('12345');
    });

    it('should update current project key in storage', function() {
      expect(Storage.setCurrentProjectKey.mock.calls).toEqual([
        ['12345'],
      ]);
    });
  });
});
