import {List} from 'immutable';

import {Test, TestResult, TestResultAssertion} from '../records';

const defaultState = new Test();

function tests(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'RUN_TESTS':
      return state.set('shouldRunTests', true).
        set('isTestResultsPaneOpen', true);

    case 'TEST_PRODUCED':
      return state.setIn(
        ['testResults', action.payload.params.id],
        new TestResult({
          name: action.payload.params.name,
          id: action.payload.params.id,
        }),
      );

    case 'TEST_ASSERTION_PRODUCED':
      return state.setIn(
        [
          'testResults',
          action.payload.params.test,
          'assertions',
          action.payload.params.id,
        ],
        TestResultAssertion.fromJS(action.payload.params),
      );

    case 'CLOSE_TEST_RESULTS_PANE':
      return state.set('isTestResultsPaneOpen', false).
        set('testResults', new List()).
        set('shouldRunTests', false);

    case 'CLOSE_TEST_CREATOR_PANE':
      return state.set('isTestCreatorPaneOpen', false);

    case 'OPEN_TEST_CREATOR_PANE':
      return state.set('isTestCreatorPaneOpen', true);

    default:
      return state;
  }
}

export default tests;
