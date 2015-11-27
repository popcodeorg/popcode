/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../projects');

var Immutable = require('immutable');

describe('projects', function() {
  var projects = require('../projects');

  describe('unknown action', function() {
    var action = {type: 'BOGUS'}

    it('should return previous state', function() {
      var stateIn = new Immutable.Map();
      expect(projects(stateIn, action)).toBe(stateIn);
    });
  });

  describe('CURRENT_PROJECT_LOADED_FROM_STORAGE', function() {
    var action = {
      type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
      payload: {
        project: {
          projectKey: '12345',
          sources: {html: '', css: '', javascript: ''},
          libraries: [],
        },
      },
    };

    it('should initialize projects map with current project', function() {
      var expected = {};
      expected[action.payload.project.projectKey] = action.payload.project;

      expect(projects(undefined, action).toJS()).toEqual(expected);
    });

    it('should add project to existing projects map', function() {
      var expected = {
        '1': {
          projectKey: '1',
          sources: {html: '', css: '', javascript: ''},
          libraries: [],
        },
      };

      var stateIn = Immutable.fromJS(expected);
      expected[action.payload.project.projectKey] = action.payload.project;

      expect(projects(stateIn, action).toJS()).toEqual(expected);
    });
  });
});
