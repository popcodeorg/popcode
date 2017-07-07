import {createAction} from 'redux-actions';

export const addRuntimeError = createAction(
  'ADD_RUNTIME_ERROR',
  (language, error) => ({language, error}),
);

export const validatedSource = createAction(
  'VALIDATED_SOURCE',
  (language, errors) => ({language, errors}),
);
