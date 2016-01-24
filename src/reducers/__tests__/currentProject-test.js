/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../currentProject');

var Immutable = require('immutable');

var blankProject = require.requireActual('../../__test__/blank').project;

describe('currentProject', function() {
  var currentProject = require('../currentProject');

  describe('unknown action', function() {
    var action = {type: 'BOGUS'};

    it('should return given state', function() {
      var state = new Immutable.Map({projectKey: '12345'});
      expect(currentProject(state, action)).toBe(state);
    });
  });

  describe('CURRENT_PROJECT_CHANGED', function() {
    var action = {
      type: 'CURRENT_PROJECT_CHANGED',
      payload: {projectKey: '12345'},
    };

    describe('with no initial project key', function() {
      it('should set current project key', function() {
        expect(currentProject(undefined, action).toJS()).toEqual(
          {projectKey: action.payload.projectKey}
        );
      });
    });

    describe('with initial project key', function() {
      it('should change current project key', function() {
        var previousState = Immutable.fromJS({projectKey: '1'});

        expect(currentProject(previousState, action).toJS()).toEqual(
          {projectKey: action.payload.projectKey}
        );
      });
    });
  });

  describe('CURRENT_PROJECT_LOADED_FROM_STORAGE', function() {
    var action = {
      type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
      payload: {project: blankProject},
    };

    it('should set current project key', function() {
      expect(currentProject(undefined, action).toJS()).toEqual(
        {projectKey: action.payload.project.projectKey}
      );
    });
  });

  describe('PROJECT_CREATED', function() {
    var action = {
      type: 'PROJECT_CREATED',
      payload: {projectKey: '12345'},
    };

    it('should set current project key', function() {
      expect(currentProject(undefined, action).toJS()).toEqual(
        {projectKey: action.payload.projectKey}
      );
    });
  });
});
