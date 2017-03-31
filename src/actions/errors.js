import {createAction} from 'redux-actions';

export const validatedSource = createAction(
  'VALIDATED_SOURCE',
  (language, errors) => ({language, errors}),
);
