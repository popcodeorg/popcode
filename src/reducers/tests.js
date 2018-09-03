import {List} from 'immutable';

import {Test} from '../records';

const defaultState = new Test();

function tests(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'RUN_TESTS':
      return state.set('shouldRunTests', true);

    case 'TESTS_COMPLETE':
      return state.set('shouldRunTests', false).update(
        'testResults',
        list => list.push(action.payload.params),
      ).set('isTestResultsPaneOpen', true);

    case 'CLOSE_TEST_RESULTS_PANE':
      return state.set('isTestResultsPaneOpen', false).
        set('testResults', new List());

    case 'CLOSE_TEST_CREATOR_PANE':
      return state.set('isTestCreatorPaneOpen', false);

    case 'OPEN_TEST_CREATOR_PANE':
      return state.set('isTestCreatorPaneOpen', true);

    default:
      return state;
  }
}

export default tests;
