import {createAction} from 'redux-actions';

const gistExportStarted = createAction('GIST_EXPORT_STARTED');
const gistExportComplete = createAction('GIST_EXPORT_COMPLETE');
const gistExportFailed = createAction('GIST_EXPORT_FAILED');

export function exportingGist(exportWillComplete) {
  return (dispatch) => {
    dispatch(gistExportStarted());
    exportWillComplete.then(() => {
      dispatch(gistExportComplete());
    }, () => {
      dispatch(gistExportFailed());
    });
  };
}
