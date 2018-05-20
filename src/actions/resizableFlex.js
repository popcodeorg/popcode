import {createAction} from 'redux-actions';

export const updateResizableFlex = createAction(
  'UPDATE_RESIZABLE_FLEX',
  (name, updates) => ({name, updates}),
);
