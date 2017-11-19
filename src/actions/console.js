import {createAction} from 'redux-actions';
import identity from 'lodash/identity';
import uuid from 'uuid/v4';

export const evaluateConsoleInput = createAction(
  'EVALUATE_CONSOLE_INPUT',
  identity,
  (_input, key = uuid().toString()) => ({key}),
);
