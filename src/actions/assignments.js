import {createAction} from 'redux-actions';


export const assignmentsLoaded = createAction('ASSIGNMENTS_LOADED');

export const assignAssignment = createAction(
  'ASSIGN_ASSIGNMENT',
  (projectKey, selectedCourse, selectedDate) =>
    ({projectKey, selectedCourse, selectedDate}),
);

export const draftAssignment = createAction(
  'DRAFT_ASSIGNMENT',
  (projectKey, selectedCourse, selectedDate) =>
    ({projectKey, selectedCourse, selectedDate}),
);

export const assignmentCreated = createAction(
  'ASSIGNMENT_CREATED',
  (projectKey, assignmentKey, snapshotKey, assignment, assignerId) =>
    ({projectKey, assignmentKey, snapshotKey, assignment, assignerId}),
);

export const assignmentSubmitted = createAction(
  'ASSIGNMENT_SUBMITTED',
  assignment => ({assignment}),
);

export const assignmentUpdated = createAction(
  'ASSIGNMENT_UPDATED',
);

export const assignmentImported = createAction(
  'ASSIGNMENT_IMPORTED',
  (projectKey, assignment) => ({projectKey, assignment}),
);

export const assignmentDisplayed = createAction(
  'ASSIGNMENT_DISPLAYED',
  assignment => (assignment),
);

export const assignmentNotFound = createAction('ASSIGNMENT_NOT_FOUND');

export const assignmentSubmissionDisplayed = createAction(
  'ASSIGNMENT_SUBMISSION_DISPLAYED',
);

export const assignmentUpdateDisplayed = createAction(
  'ASSIGNMENT_UPDATE_DISPLAYED',
);

export const assignmentImportError = createAction('ASSIGNMENT_IMPORT_ERROR');
