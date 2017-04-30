import {createAction} from 'redux-actions';

export const exportGist = createAction('EXPORT_GIST');
export const gistExported = createAction('GIST_EXPORTED');
export const gistExportError = createAction('GIST_EXPORT_ERROR');
export const gistExportDisplayed = createAction('GIST_EXPORT_DISPLAYED');
export const gistExportNotDisplayed =
  createAction('GIST_EXPORT_NOT_DISPLAYED');
