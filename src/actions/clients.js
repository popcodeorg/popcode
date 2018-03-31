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

export const createAssignment = createAction(
  'CREATE_ASSIGNMENT',
  (type, projectKey, selectedCourse, selectedDate) => ({type, projectKey, selectedCourse, selectedDate}),
);

export const updateAssignment = createAction(
  'UPDATE_ASSIGNMENT',
);

export const submitAssignment = createAction(
  'SUBMIT_ASSIGNMENT',
);

// export const assignmentDisplayed = createAction(
//   'ASSIGNMENT_DISPLAYED',
//   assignment => (assignment),
// );

// export const assignmentSubmissionDisplayed = createAction(
//   'ASSIGNMENT_SUBMISSION_DISPLAYED',
// );

// export const assignmentNotFound = createAction('ASSIGNMENT_NOT_FOUND');

// export const assignmentImportError = createAction('ASSIGNMENT_IMPORT_ERROR');

// export const assignmentImported = createAction(
//   'ASSIGNMENT_IMPORTED',
//   (projectKey, assignment) => ({projectKey, assignment}),
// );

// export const assignmentCreated = createAction(
//   'ASSIGNMENT_CREATED',
//   (projectKey, assignmentKey, snapshotKey, assignment, assignerId) =>
//     ({projectKey, assignmentKey, snapshotKey, assignment, assignerId}),
// );

// export const assignmentsLoaded = createAction('ASSIGNMENTS_LOADED');

// export const assignmentSubmitted = createAction(
//   'ASSIGNMENT_SUBMITTED',
//   assignment => ({assignment}),
// );
