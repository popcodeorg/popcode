import {createAction} from 'redux-actions';
import identity from 'lodash/identity';
import uuid from 'uuid/v4';

export const consoleValueProduced = createAction(
  'CONSOLE_VALUE_PRODUCED',
  (key, value) => ({key, value}),
);

export const consoleErrorProduced = createAction(
  'CONSOLE_ERROR_PRODUCED',
  (key, name, message) => ({key, name, message}),
);

export const evaluateConsoleEntry = createAction(
  'EVALUATE_CONSOLE_ENTRY',
  identity,
  (_input, key = uuid().toString()) => ({key}),
);
