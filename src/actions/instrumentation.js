import {createAction} from 'redux-actions';

export const editorReady = createAction(
  'EDITOR_READY',
  (language, timestamp) => ({
    language,
    timestamp,
  }),
);
