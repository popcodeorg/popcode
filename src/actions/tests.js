import {createAction} from 'redux-actions';

export const runTests = createAction(
  'RUN_TESTS',
);

export const testProduced = createAction(
  'TEST_PRODUCED',
  params => ({params}),
);

export const testAssertionProduced = createAction(
  'TEST_ASSERTION_PRODUCED',
  params => ({params}),
);

export const addTestRow = createAction(
  'ADD_TEST_ROW',
);

export const saveTests = createAction(
  'SAVE_TESTS',
  (tests, currentProjectKey) => ({tests, currentProjectKey}),
  (_projectKey, timestamp = Date.now()) => ({timestamp}),
);

export const closeTestCreatorPane = createAction(
  'CLOSE_TEST_CREATOR_PANE',
);

export const openTestCreatorPane = createAction(
  'OPEN_TEST_CREATOR_PANE',
);

export const closeTestResultsPane = createAction(
  'CLOSE_TEST_RESULTS_PANE',
  (timestamp = Date.now()) => ({timestamp}),
);

export const addTest = createAction(
  'ADD_TEST',
  projectKey => ({projectKey}),
  (_projectKey, timestamp = Date.now()) => ({timestamp}),
);
