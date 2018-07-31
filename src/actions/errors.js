import {createAction} from 'redux-actions';
import uuid from 'uuid/v4';

export const addRuntimeError = createAction(
  'ADD_RUNTIME_ERROR',
  (language, error, compiledProjectKey, key = uuid().toString()) => ({language, error, compiledProjectKey, key})
);

export const validatedSource = createAction(
  'VALIDATED_SOURCE',
  (language, errors) => ({language, errors}),
);
