import {createAction} from 'redux-actions';

const gistExportStarted = createAction('GIST_EXPORT_STARTED');
const gistExportComplete = createAction('GIST_EXPORT_COMPLETE');
const gistExportFailed = createAction('GIST_EXPORT_FAILED');

export function exportingGist(exportWillComplete) {
  return async (dispatch) => {
    dispatch(gistExportStarted());
    try {
      await exportWillComplete;
      dispatch(gistExportComplete());
    } catch (_e) {
      dispatch(gistExportFailed());
    }
  };
}
