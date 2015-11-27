/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../currentProject');

describe('currentProject', function() {
  var currentProject = require('../currentProject');

  describe('with no initial project key', function() {
    var action = {
      type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
      payload: {project: {projectKey: '12345'}},
    };

    it('should set current project key', function() {
      expect(currentProject(undefined, action).toJS()).toEqual(
        {projectKey: action.payload.project.projectKey}
      );
    });
  });
});
