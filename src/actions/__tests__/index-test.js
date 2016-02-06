/* eslint-env jest */
/* eslint global-require: 0 */

var each = require('lodash/each');
var map = require('lodash/map');
var assign = require('lodash/assign');
var keyBy = require('lodash/keyBy');

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

  function expectActions() {
    var resolveFns = {};
    dispatch.promised = {};

    each(arguments, function(actionType) {
      dispatch.promised[actionType] = new Promise(function(resolve) {
        resolveFns[actionType] = resolve;
      });
    });

    dispatch.mockImplementation(function(action) {
      if (resolveFns[action.type]) {
        resolveFns[action.type](action);
      }
    });
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

      getState.mockReturnValue(blank.state);
      each(validations, function(validation) {
        validation.mockImplementation(function() {
          return Promise.resolve([]);
        });
      });

      expectActions(
        'CURRENT_PROJECT_LOADED_FROM_STORAGE',
        'VALIDATING_SOURCE',
        'VALIDATED_SOURCE'
      );

      dispatchThunkAction(Actions.loadCurrentProjectFromStorage());
    });

    pit('should dispatch CURRENT_PROJECT_LOADED_FROM_STORAGE', function() {
      return dispatch.promised.CURRENT_PROJECT_LOADED_FROM_STORAGE.
        then(function(action) {
          expect(action).toBeDefined();
        });
    });

    pit('should pass project in payload', function() {
      return dispatch.promised.CURRENT_PROJECT_LOADED_FROM_STORAGE.
        then(function(action) {
          expect(action.payload.project).toBe(blank.project);
        });
    });

    pit('should dispatch VALIDATING_SOURCE', function() {
      return dispatch.promised.VALIDATING_SOURCE.then(function(action) {
        expect(action).toBeDefined();
      });
    });

    pit('should dispatch VALIDATED_SOURCE', function() {
      return dispatch.promised.VALIDATED_SOURCE.then(function(action) {
        expect(action).toBeDefined();
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

      this.actionsDispatched = keyBy(map(dispatch.mock.calls, 0), 'type');
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

    it('should include language in validation starting action', function() {
      expect(this.actionsDispatched.VALIDATING_SOURCE.payload.language).
        toBe('css');
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

    pit('should send errors in validation complete action', function() {
      return this.promisedValidatedSourceAction.then(function(action) {
        expect(action.payload.language).toBe('css');
      });
    });

    it('should save project', function() {
      expect(Storage.save.mock.calls).toEqual([
        [blank.project],
      ]);
    });
  });

  describe('changeCurrentProject', function() {
    beforeEach(function() {
      expectActions(
        'CURRENT_PROJECT_CHANGED',
        'VALIDATING_SOURCE',
        'VALIDATED_SOURCE'
      );

      getState.mockReturnValue(blank.state);

      each(validations, function(validation) {
        validation.mockImplementation(function() {
          return Promise.resolve([]);
        });
      });

      dispatchThunkAction(Actions.changeCurrentProject('12345'));
    });

    pit('should dispatch CURRENT_PROJECT_CHANGED', function() {
      return dispatch.promised.CURRENT_PROJECT_CHANGED.then(function(action) {
        expect(action).toBeDefined();
      });
    });

    pit('should dispatch project key in the payload', function() {
      return dispatch.promised.CURRENT_PROJECT_CHANGED.then(function(action) {
        expect(action.payload.projectKey).toBe('12345');
      });
    });

    pit('should update current project key in storage', function() {
      return dispatch.promised.CURRENT_PROJECT_CHANGED.then(function() {
        expect(Storage.setCurrentProjectKey.mock.calls).toEqual([
          ['12345'],
        ]);
      });
    });

    pit('should validate sources', function() {
      return dispatch.promised.VALIDATING_SOURCE.then(function(action) {
        expect(action).toBeDefined();
      });
    });

    pit('should finish validating sources', function() {
      return dispatch.promised.VALIDATED_SOURCE.then(function(action) {
        expect(action).toBeDefined();
      });
    });
  });

  describe('toggleLibrary', function() {
    beforeEach(function() {
      expectActions(
        'PROJECT_LIBRARY_TOGGLED',
        'VALIDATING_SOURCE',
        'VALIDATED_SOURCE'
      );

      getState.mockReturnValue(blank.state);
      each(validations, function(validation) {
        validation.mockImplementation(function() {
          return Promise.resolve([]);
        });
      });

      dispatchThunkAction(Actions.toggleLibrary('12345', 'jquery'));
    });

    pit('should dispatch PROJECT_LIBRARY_TOGGLED with library', function() {
      return dispatch.promised.PROJECT_LIBRARY_TOGGLED.then(function(action) {
        expect(action.payload.libraryKey).toBe('jquery');
      });
    });

    pit('should dispatch PROJECT_LIBRARY_TOGGLED with project', function() {
      return dispatch.promised.PROJECT_LIBRARY_TOGGLED.then(function(action) {
        expect(action.payload.projectKey).toBe('12345');
      });
    });

    pit('should dispatch VALIDATING_SOURCE', function() {
      return dispatch.promised.VALIDATING_SOURCE;
    });

    pit('should dispatch VALIDATED_SOURCE', function() {
      return dispatch.promised.VALIDATED_SOURCE;
    });
  });

  describe('loadAllProjects', function() {
    beforeEach(function() {
      expectActions('PROJECT_LOADED_FROM_STORAGE');

      getState.mockReturnValue(blank.state);

      Storage.all.mockReturnValue(
        Promise.resolve([
          assign({}, blank.project, {projectKey: '23456'}),
        ])
      );

      dispatchThunkAction(Actions.loadAllProjects());
    });

    pit('should dispatch PROJECT_LOADED_FROM_STORAGE', function() {
      return dispatch.promised.PROJECT_LOADED_FROM_STORAGE.
        then(function(action) {
          expect(action.payload.project.projectKey).toBe('23456');
        });
    });
  });
});
