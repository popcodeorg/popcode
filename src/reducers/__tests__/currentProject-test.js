/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../currentProject');

import Immutable from 'immutable';

const blankProject = require.requireActual('../../__test__/blank').project;

describe('currentProject', () => {
  const currentProject = require('../currentProject').default;

  describe('unknown action', () => {
    const action = {type: 'BOGUS'};

    it('should return given state', () => {
      const state = new Immutable.Map({projectKey: '12345'});
      expect(currentProject(state, action)).toBe(state);
    });
  });

  describe('CURRENT_PROJECT_CHANGED', () => {
    const action = {
      type: 'CURRENT_PROJECT_CHANGED',
      payload: {projectKey: '12345'},
    };

    describe('with no initial project key', () => {
      it('should set current project key', () => {
        expect(currentProject(undefined, action).toJS()).
          toEqual({projectKey: action.payload.projectKey});
      });
    });

    describe('with initial project key', () => {
      it('should change current project key', () => {
        const previousState = Immutable.fromJS({projectKey: '1'});

        expect(currentProject(previousState, action).toJS()).
          toEqual({projectKey: action.payload.projectKey});
      });
    });
  });

  describe('CURRENT_PROJECT_LOADED_FROM_STORAGE', () => {
    const action = {
      type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
      payload: {project: blankProject},
    };

    it('should set current project key', () => {
      expect(currentProject(undefined, action).toJS()).
        toEqual({projectKey: action.payload.project.projectKey});
    });
  });

  describe('PROJECT_CREATED', () => {
    const action = {
      type: 'PROJECT_CREATED',
      payload: {projectKey: '12345'},
    };

    it('should set current project key', () => {
      expect(currentProject(undefined, action).toJS()).
        toEqual({projectKey: action.payload.projectKey});
    });
  });
});
