import {createAction} from 'redux-actions';

export const createAssignment = createAction(
  'CREATE_ASSIGNMENT',
  (selectedCourseId, dueDate, assignmentState) => ({
    selectedCourseId,
    dueDate,
    assignmentState,
  }),
);

export const assignmentCreated = createAction(
  'ASSIGNMENT_CREATED',
  assignment => ({assignment}),
);

export const assignmentNotCreated = createAction('ASSIGNMENT_NOT_CREATED');
