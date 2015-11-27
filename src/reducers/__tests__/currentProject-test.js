/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../currentProject');

var Immutable = require('immutable');

describe('currentProject', function() {
  var currentProject = require('../currentProject');

  describe('CURRENT_PROJECT_LOADED_FROM_STORAGE', function() {
    var action = {
      type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
      payload: {project: {projectKey: '12345'}},
    };

    describe('with no initial project key', function() {
      it('should set current project key', function() {
        expect(currentProject(undefined, action).toJS()).toEqual(
          {projectKey: action.payload.project.projectKey}
        );
      });
    });

    describe('with initial project key', function() {
      it('should change current project key', function() {
        var previousState = Immutable.fromJS({projectKey: '1'});

        expect(currentProject(previousState, action).toJS()).toEqual(
          {projectKey: action.payload.project.projectKey}
        );
      });
    });
  });
});
