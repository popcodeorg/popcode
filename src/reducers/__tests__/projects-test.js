/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../projects');

var Immutable = require('immutable');

describe('currentProject', function() {
  var project = require('../projects');

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

      expect(project(undefined, action).toJS()).toEqual(expected);
    });
  });
});
