import {createAction} from 'redux-actions';
import identity from 'lodash-es/identity';
import uuid from 'uuid/v4';

export const consoleValueProduced = createAction(
  'CONSOLE_VALUE_PRODUCED',
  (key, value, compiledProjectKey) => ({key, value, compiledProjectKey}),
);

export const consoleErrorProduced = createAction(
  'CONSOLE_ERROR_PRODUCED',
  (key, compiledProjectKey, error) => ({key, compiledProjectKey, error}),
);

export const evaluateConsoleEntry = createAction(
  'EVALUATE_CONSOLE_ENTRY',
  identity,
  (_input, key = uuid().toString()) => ({key}),
);

export const clearConsoleEntries = createAction('CLEAR_CONSOLE_ENTRIES');

export const previousConsoleHistory = createAction('PREVIOUS_CONSOLE_HISTORY');

export const nextConsoleHistory = createAction('NEXT_CONSOLE_HISTORY');

export const consoleInputChanged = createAction(
  'CONSOLE_INPUT_CHANGED',
  value => ({value}),
);

export const consoleLogBatchProduced = createAction(
  'CONSOLE_LOG_BATCH_PRODUCED',
  entries => ({entries}),
);
