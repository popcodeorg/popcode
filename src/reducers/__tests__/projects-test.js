/* eslint-env jest */
/* eslint global-require: 0 no-invalid-this: 0 */

jest.dontMock('../projects');

import Immutable from 'immutable';

describe('projects', () => {
  const projects = require('../projects').default;

  describe('unknown action', () => {
    const action = {type: 'BOGUS'};

    it('should return previous state', () => {
      const stateIn = new Immutable.Map();
      expect(projects(stateIn, action)).toBe(stateIn);
    });
  });

  [
    'PROJECT_LOADED_FROM_STORAGE',
    'CURRENT_PROJECT_LOADED_FROM_STORAGE',
  ].forEach((actionType) => {
    describe(actionType, () => {
      const action = {
        type: actionType,
        payload: {
          project: {
            projectKey: '12345',
            sources: {html: '', css: '', javascript: ''},
            enabledLibraries: [],
          },
        },
      };

      it('should initialize projects map with current project', () => {
        const expected = {};
        expected[action.payload.project.projectKey] = action.payload.project;

        expect(projects(undefined, action).toJS()).toEqual(expected);
      });

      it('should add project to existing projects map', () => {
        const stateIn = Immutable.fromJS({
          1: {
            projectKey: '1',
            sources: {html: '', css: '', javascript: ''},
            enabledLibraries: new Immutable.Set(),
          },
        });

        const expected = stateIn.set(
          action.payload.project.projectKey,
          projects.projectToImmutable(action.payload.project)
        );

        expect(Immutable.is(
          projects(stateIn, action),
          Immutable.fromJS(expected)
        )).toBeTruthy();
      });
    });
  });

  describe('PROJECT_SOURCE_EDITED', () => {
    const timestamp = Date.now();
    const action = {
      type: 'PROJECT_SOURCE_EDITED',
      meta: {timestamp},
      payload: {
        projectKey: '12345',
        language: 'css',
        newValue: 'p { color: red; }',
      },
    };

    const stateIn = Immutable.fromJS({
      12345: {
        projectKey: '12345',
        sources: {html: '', css: '', javascript: ''},
        enabledLibraries: [],
      },
    });

    it('should update source of known project', () => {
      const expected = stateIn.setIn(
        ['12345', 'sources', 'css'],
        action.payload.newValue
      ).setIn(['12345', 'updatedAt'], timestamp).toJS();

      expect(projects(stateIn, action).toJS()).toEqual(expected);
    });
  });

  describe('PROJECT_CREATED', () => {
    const action = {
      type: 'PROJECT_CREATED',
      payload: {projectKey: '12345'},
    };

    beforeEach(function() {
      this.newState = projects(undefined, action);
    });

    it('should add new project to map', function() {
      expect(this.newState.getIn(['12345', 'projectKey'])).
        toEqual('12345');
    });

    it('should initialize new project with sources', function() {
      expect(this.newState.getIn(['12345', 'sources', 'html'])).toBeDefined();
    });

    it('should initialize new project with enabled libraries', function() {
      expect(
        Immutable.Set.isSet(this.newState.getIn(['12345', 'enabledLibraries']))
      ).toBeTruthy();
    });
  });

  describe('PROJECT_LIBRARY_TOGGLED', () => {
    const action = {
      type: 'PROJECT_LIBRARY_TOGGLED',
      meta: {timestamp: Date.now()},
      payload: {projectKey: '12345', libraryKey: 'jquery'},
    };

    describe('when library is not enabled', () => {
      beforeEach(function() {
        this.newState = projects(Immutable.fromJS({
          12345: {enabledLibraries: new Immutable.Set(['lodash'])},
        }), action);
      });

      it('should add library', function() {
        expect(
          this.newState.getIn(['12345', 'enabledLibraries']).
            includes('jquery')
        ).toBeTruthy();
      });

      it('should retain existing library', function() {
        expect(
          this.newState.getIn(['12345', 'enabledLibraries']).
            includes('lodash')
        ).toBeTruthy();
      });
    });

    describe('when library is enabled', () => {
      beforeEach(function() {
        this.newState = projects(Immutable.fromJS({
          12345: {enabledLibraries: new Immutable.Set(['lodash', 'jquery'])},
        }), action);
      });

      it('should remove library', function() {
        expect(
          this.newState.getIn(['12345', 'enabledLibraries']).
            includes('jquery')
        ).toBeFalsy();
      });

      it('should retain existing library', function() {
        expect(
          this.newState.getIn(['12345', 'enabledLibraries']).
            includes('lodash')
        ).toBeTruthy();
      });
    });
  });
});
