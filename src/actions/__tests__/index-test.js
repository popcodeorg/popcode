/* eslint-env jest */
/* eslint global-require:0 no-invalid-this:0 */
import each from 'lodash/each';
import map from 'lodash/map';
import assign from 'lodash/assign';
import keyBy from 'lodash/keyBy';

const blank = require.requireActual('../../__test__/blank');

describe('index', () => {
  const validations = {
    html: jest.genMockFn(),
    css: jest.genMockFn(),
    javascript: jest.genMockFn(),
  };
  jest.setMock('../../validations', validations);

  const Actions = require.requireActual('../index');
  const Storage = require('../../services/Storage');
  let dispatch, getState;

  function dispatchThunkAction(action) {
    action(dispatch, getState);
  }

  function expectActions(...actionTypes) {
    const resolveFns = {};
    dispatch.promised = {};

    each(actionTypes, (actionType) => {
      dispatch.promised[actionType] = new Promise((resolve) => {
        resolveFns[actionType] = resolve;
      });
    });

    dispatch.mockImplementation((action) => {
      if (resolveFns[action.type]) {
        resolveFns[action.type](action);
      }
    });
  }

  beforeEach(() => {
    dispatch = jest.genMockFunction();
    getState = jest.genMockFunction();
  });

  afterEach(() => {
    Storage.setCurrentProjectKey.mockClear();
    Storage.save.mockClear();
  });

  describe('createProject', () => {
    beforeEach(function() {
      getState.mockReturnValue(blank.state);

      dispatchThunkAction(Actions.createProject());
      this.dispatchedAction = dispatch.mock.calls[0][0];
    });

    it('should dispatch one action', () => {
      expect(dispatch.mock.calls.length).toBe(1);
    });

    it('should dispatch PROJECT_CREATED action', function() {
      expect(this.dispatchedAction.type).toBe('PROJECT_CREATED');
    });

    it('should add a project key', function() {
      expect(this.dispatchedAction.payload.projectKey).toBeDefined();
    });

    it('should save current project key', () => {
      expect(Storage.setCurrentProjectKey.mock.calls).
        toEqual([['12345']]);
    });

    it('should save new project', () => {
      expect(Storage.save.mock.calls).
        toEqual([
          [blank.project],
        ]);
    });
  });

  describe('loadCurrentProjectFromStorage with project', () => {
    beforeEach(() => {
      Storage.getCurrentProjectKey.mockReturnValue(
        Promise.resolve(blank.project.projectKey)
      );
      Storage.load.mockReturnValue(Promise.resolve(blank.project));

      getState.mockReturnValue(blank.state);
      each(validations, (validation) => {
        validation.mockImplementation(() => Promise.resolve([]));
      });

      expectActions(
        'CURRENT_PROJECT_LOADED_FROM_STORAGE',
        'VALIDATING_SOURCE',
        'VALIDATED_SOURCE'
      );

      dispatchThunkAction(Actions.loadCurrentProjectFromStorage());
    });

    pit(
      'should dispatch CURRENT_PROJECT_LOADED_FROM_STORAGE',
      () => dispatch.promised.CURRENT_PROJECT_LOADED_FROM_STORAGE.
        then((action) => {
          expect(action).toBeDefined();
        })
    );

    pit(
      'should pass project in payload',
      () => dispatch.promised.CURRENT_PROJECT_LOADED_FROM_STORAGE.
        then((action) => {
          expect(action.payload.project).toBe(blank.project);
        })
    );

    pit(
      'should dispatch VALIDATING_SOURCE',
      () => dispatch.promised.VALIDATING_SOURCE.then((action) => {
        expect(action).toBeDefined();
      })
    );

    pit(
      'should dispatch VALIDATED_SOURCE',
      () => dispatch.promised.VALIDATED_SOURCE.then((action) => {
        expect(action).toBeDefined();
      })
    );
  });

  describe('loadCurrentProjectFromStorage with no project', () => {
    beforeEach(function() {
      Storage.getCurrentProjectKey.mockReturnValue(Promise.resolve(undefined));
      dispatchThunkAction(Actions.loadCurrentProjectFromStorage());

      this.actionsDispatched = new Promise(dispatch.mockImplementation).
        then(() => dispatch.mock.calls[0][0]);
    });

    pit('should dispatch PROJECT_CREATED action', function() {
      return this.actionsDispatched.then((action) => {
        expect(action.type).toBe('PROJECT_CREATED');
      });
    });
  });

  describe('updateProjectSource', () => {
    beforeEach(function() {
      getState.mockReturnValue(blank.state);

      this.promisedValidatedSourceAction = new Promise((resolve) => {
        dispatch.mockImplementation((action) => {
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
      return this.promisedValidatedSourceAction.then((action) => {
        expect(action).toBeDefined();
      });
    });

    pit('should send errors in validation complete action', function() {
      return this.promisedValidatedSourceAction.then((action) => {
        expect(action.payload.errors).toEqual([this.error]);
      });
    });

    pit('should send errors in validation complete action', function() {
      return this.promisedValidatedSourceAction.then((action) => {
        expect(action.payload.language).toBe('css');
      });
    });

    it('should save project', () => {
      expect(Storage.save.mock.calls).toEqual([
        [blank.project],
      ]);
    });
  });

  describe('changeCurrentProject', () => {
    beforeEach(() => {
      expectActions(
        'CURRENT_PROJECT_CHANGED',
        'VALIDATING_SOURCE',
        'VALIDATED_SOURCE'
      );

      getState.mockReturnValue(blank.state);

      each(validations, (validation) => {
        validation.mockImplementation(() => Promise.resolve([]));
      });

      dispatchThunkAction(Actions.changeCurrentProject('12345'));
    });

    pit(
      'should dispatch CURRENT_PROJECT_CHANGED',
      () => dispatch.promised.CURRENT_PROJECT_CHANGED.then((action) => {
        expect(action).toBeDefined();
      })
    );

    pit(
      'should dispatch project key in the payload',
      () => dispatch.promised.CURRENT_PROJECT_CHANGED.then((action) => {
        expect(action.payload.projectKey).toBe('12345');
      })
    );

    pit(
      'should update current project key in storage',
      () => dispatch.promised.CURRENT_PROJECT_CHANGED.then(() => {
        expect(Storage.setCurrentProjectKey.mock.calls).toEqual([
          ['12345'],
        ]);
      })
    );

    pit(
      'should validate sources',
      () => dispatch.promised.VALIDATING_SOURCE.then((action) => {
        expect(action).toBeDefined();
      })
    );

    pit(
      'should finish validating sources',
      () => dispatch.promised.VALIDATED_SOURCE.then((action) => {
        expect(action).toBeDefined();
      })
    );
  });

  describe('toggleLibrary', () => {
    beforeEach(() => {
      expectActions(
        'PROJECT_LIBRARY_TOGGLED',
        'VALIDATING_SOURCE',
        'VALIDATED_SOURCE'
      );

      getState.mockReturnValue(blank.state);
      each(validations, (validation) => {
        validation.mockImplementation(() => Promise.resolve([]));
      });

      dispatchThunkAction(Actions.toggleLibrary('12345', 'jquery'));
    });

    pit(
      'should dispatch PROJECT_LIBRARY_TOGGLED with library',
      () => dispatch.promised.PROJECT_LIBRARY_TOGGLED.then((action) => {
        expect(action.payload.libraryKey).toBe('jquery');
      })
    );

    pit(
      'should dispatch PROJECT_LIBRARY_TOGGLED with project',
      () => dispatch.promised.PROJECT_LIBRARY_TOGGLED.then((action) => {
        expect(action.payload.projectKey).toBe('12345');
      })
    );

    pit(
      'should dispatch VALIDATING_SOURCE',
      () => dispatch.promised.VALIDATING_SOURCE
    );

    pit(
      'should dispatch VALIDATED_SOURCE',
      () => dispatch.promised.VALIDATED_SOURCE
    );
  });

  describe('loadAllProjects', () => {
    beforeEach(() => {
      expectActions('PROJECT_LOADED_FROM_STORAGE');

      getState.mockReturnValue(blank.state);

      Storage.all.mockReturnValue(Promise.resolve([
        assign({}, blank.project, {projectKey: '23456'}),
      ]));

      dispatchThunkAction(Actions.loadAllProjects());
    });

    pit(
      'should dispatch PROJECT_LOADED_FROM_STORAGE',
      () => dispatch.promised.PROJECT_LOADED_FROM_STORAGE.
        then((action) => {
          expect(action.payload.project.projectKey).toBe('23456');
        })
    );
  });
});
