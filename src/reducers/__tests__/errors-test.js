/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../errors');

import Immutable from 'immutable';

describe('errors', () => {
  const errors = require('../errors');

  describe('unknown action', () => {
    const action = {type: 'BOGUS'};

    it('should return previous state', () => {
      const stateIn = new Immutable.Map();
      expect(errors(stateIn, action)).toBe(stateIn);
    });
  });

  [
    'CURRENT_PROJECT_LOADED_FROM_STORAGE',
    'CURRENT_PROJECT_CHANGED',
  ].forEach((actionType) => {
    describe(actionType, () => {
      const action = {
        type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
        payload: {},
      };

      it('should clear errors', () => {
        const stateIn = Immutable.fromJS({
          html: [{}],
          css: [{}],
          javascript: [{}],
        });

        expect(errors(stateIn, action).get('html').size).toBe(0);
      });
    });
  });

  describe('VALIDATING_SOURCE', () => {
    const action = {
      type: 'VALIDATING_SOURCE',
      payload: {language: 'javascript'},
    };

    it('should provide map from undefined state', () => {
      expect(Immutable.Map.isMap(errors(undefined, action))).toBeTruthy();
    });

    it('should remove errors', () => {
      const stateIn = Immutable.fromJS({html: [], css: [], javascript: []});
      expect(errors(stateIn, action).get('javascript').size).toBe(0);
    });
  });

  describe('VALIDATED_SOURCE', () => {
    const error = {};

    const action = {
      type: 'VALIDATED_SOURCE',
      payload: {
        language: 'javascript',
        errors: [error],
      },
    };

    it('should set errors where there were none', () => {
      const stateIn = Immutable.fromJS({html: [], css: []});
      expect(Immutable.is(
        errors(stateIn, action).get('javascript').get(0),
        Immutable.fromJS(error)
      )).toBeTruthy();
    });
  });
});
