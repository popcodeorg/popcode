import {createAction} from 'redux-actions';

export const exportGist = createAction('EXPORT_GIST');
export const gistExported = createAction('GIST_EXPORTED');
export const gistExportError = createAction('GIST_EXPORT_ERROR');
