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

export const updateCourses = createAction(
  'UPDATE_COURSES',
  courses => ({courses}),
);

export const createCourseWork = createAction(
  'CREATE_COURSE_WORK',
  (type, selectedCourse) => ({type, selectedCourse}),
);

export const courseWorkDisplayed = createAction(
  'COURSE_WORK_DISPLAYED',
  courseWork => (courseWork),
);

export const courseWorkCreated = createAction(
  'COURSE_WORK_CREATED',
  courseWork => ({courseWork}),
);

export const submitAssignment = createAction(
  'SUBMIT_ASSIGNMENT',
);

export const assignmentSubmitted = createAction(
  'ASSIGNMENT_SUBMITTED',
  assignment => ({assignment}),
);

export const assignmentSubmissionDisplayed = createAction(
  'ASSIGNMENT_SUBMISSION_DISPLAYED',
);
