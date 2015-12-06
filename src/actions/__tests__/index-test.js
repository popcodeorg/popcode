/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('..');

describe('errors', function() {
  var Actions = require('..');
  var dispatch;

  beforeEach(function() {
    dispatch = jest.genMockFunction();
  });

  describe('createProject', function() {
    beforeEach(function() {
      var createProjectFn = Actions.createProject();
      createProjectFn(dispatch);
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
  });
});
