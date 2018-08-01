import {createAction} from 'redux-actions';
import identity from 'lodash-es/identity';
import uuid from 'uuid/v4';

export const consoleValueProduced = createAction(
  'CONSOLE_VALUE_PRODUCED',
  (key, value, compiledProjectKey) =>
    ({key, value, compiledProjectKey}),
);

export const consoleErrorProduced = createAction(
  'CONSOLE_ERROR_PRODUCED',
  (key, name, message, compiledProjectKey) =>
    ({key, name, message, compiledProjectKey}),
);

export const evaluateConsoleEntry = createAction(
  'EVALUATE_CONSOLE_ENTRY',
  identity,
  (_input, key = uuid().toString()) => ({key}),
);

export const clearConsoleEntries = createAction(
  'CLEAR_CONSOLE_ENTRIES',
);

export const setPreviousHistoryIndex = createAction(
  'SET_PREVIOUS_HISTORY_INDEX',
);

export const setCurrentConsoleInput = createAction(
  'SET_CURRENT_CONSOLE_INPUT',
);

export const consoleLogProduced = createAction(
  'CONSOLE_LOG_PRODUCED',
  (value, compiledProjectKey) => ({value, compiledProjectKey}),
  (_value, _compiledProjectKey, key = uuid().toString()) => ({key}),
);
