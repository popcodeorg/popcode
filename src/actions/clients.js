import {createAction} from 'redux-actions';

export const createSnapshot = createAction('CREATE_SNAPSHOT');
export const snapshotCreated = createAction('SNAPSHOT_CREATED');
export const snapshotExportError = createAction('SNAPSHOT_EXPORT_ERROR');
export const snapshotNotFound = createAction('SNAPSHOT_NOT_FOUND');
export const snapshotImported = createAction(
  'SNAPSHOT_IMPORTED',
  (projectKey, project) => ({projectKey, project}),
);
export const snapshotImportError = createAction('SNAPSHOT_IMPORT_ERROR');
export const projectRestoredFromLastSession =
  createAction('PROJECT_RESTORED_FROM_LAST_SESSION');
export const exportProject = createAction(
  'EXPORT_PROJECT',
  exportType => ({exportType}),
);
export const projectExported = createAction(
  'PROJECT_EXPORTED',
  (url, exportType, projectKey, exportData) => ({
    url,
    exportType,
    projectKey,
    exportData,
  }),
  (_url, _exportType, _projectKey, _exportData, timestamp = Date.now()) =>
    ({timestamp}),
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

export const gapiClientReady = createAction('GAPI_CLIENT_READY');
