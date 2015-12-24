/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../errors');

var Immutable = require('immutable');

describe('errors', function() {
  var errors = require('../errors');

  describe('unknown action', function() {
    var action = {type: 'BOGUS'};

    it('should return previous state', function() {
      var stateIn = new Immutable.Map();
      expect(errors(stateIn, action)).toBe(stateIn);
    });
  });

  describe('VALIDATING_SOURCE', function() {
    var action = {
      type: 'VALIDATING_SOURCE',
      language: 'javascript',
    };

    it('should provide empty map from undefined state', function() {
      expect(Immutable.Map.isMap(errors(undefined, action))).toBeTruthy();
    });

    it('should remove errors', function() {
      var stateIn = Immutable.fromJS({html: [], css: [], javascript: []});
      expect(errors(stateIn, action).has('javascript')).toBeFalsy();
    });
  });

  describe('VALIDATED_SOURCE', function() {
    var error = {};

    var action = {
      type: 'VALIDATED_SOURCE',
      language: 'javascript',
      errors: [error],
    };

    it('should set errors where there were none', function() {
      var stateIn = Immutable.fromJS({html: [], css: []});
      expect(Immutable.is(
        errors(stateIn, action).get('javascript').get(0),
        Immutable.fromJS(error)
      )).toBeTruthy();
    });
  });
});
