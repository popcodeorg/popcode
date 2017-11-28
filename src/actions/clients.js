import {createAction} from 'redux-actions';

export const createSnapshot = createAction('CREATE_SNAPSHOT');
export const snapshotCreated = createAction('SNAPSHOT_CREATED');
export const snapshotExportError = createAction('SNAPSHOT_EXPORT_ERROR');
export const snapshotNotFound = createAction('SNAPSHOT_NOT_FOUND');
export const snapshotImported = createAction('SNAPSHOT_IMPORTED');
export const snapshotImportError = createAction('SNAPSHOT_IMPORT_ERROR');
export const projectRestoredFromLastSession =
  createAction('PROJECT_RESTORED_FROM_LAST_SESSION');
export const exportProject = createAction(
  'EXPORT_PROJECT',
  exportType => ({exportType}),
);
export const projectExported = createAction(
  'PROJECT_EXPORTED',
  (url, exportType) => ({url, exportType}),
);
export const projectExportError = createAction(
  'PROJECT_EXPORT_ERROR',
  exportType => ({exportType}),
);
export const projectExportDisplayed = createAction('PROJECT_EXPORT_DISPLAYED');
export const projectExportNotDisplayed = createAction(
  'PROJECT_EXPORT_NOT_DISPLAYED',
  (url, exportType) => ({url, exportType}),
);

