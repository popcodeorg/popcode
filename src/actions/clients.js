import {createAction} from 'redux-actions';

export const createSnapshot = createAction('CREATE_SNAPSHOT');
export const snapshotCreated = createAction('SNAPSHOT_CREATED');
export const snapshotExportError = createAction('SNAPSHOT_EXPORT_ERROR');
export const snapshotNotFound = createAction('SNAPSHOT_NOT_FOUND');
export const exportGist = createAction('EXPORT_GIST');
export const snapshotImported = createAction('SNAPSHOT_IMPORTED');
export const snapshotImportError = createAction('SNAPSHOT_IMPORT_ERROR');
export const gistExported = createAction('GIST_EXPORTED');
export const gistExportError = createAction('GIST_EXPORT_ERROR');
export const gistExportDisplayed = createAction('GIST_EXPORT_DISPLAYED');
export const gistExportNotDisplayed =
  createAction('GIST_EXPORT_NOT_DISPLAYED');
export const exportRepo = createAction('EXPORT_REPO');
export const repoExported = createAction('REPO_EXPORTED');
export const repoExportError = createAction('REPO_EXPORT_ERROR');
export const repoExportDisplayed = createAction('REPO_EXPORT_DISPLAYED');
export const repoExportNotDisplayed =
  createAction('REPO_EXPORT_NOT_DISPLAYED');
export const projectRestoredFromLastSession =
  createAction('PROJECT_RESTORED_FROM_LAST_SESSION');
