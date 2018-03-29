import Immutable from 'immutable';

import {Assignment} from '../records';

const defaultState = new Immutable.Map({
  firebase: new Immutable.Map({exportingSnapshot: false}),
  projectExports: new Immutable.Map(),
  courses: new Immutable.List(),
  assignments: new Immutable.Map(),
});

function addAssignment(state, assignment) {
  return state.setIn(
    ['assignments', assignment.assignmentKey],
    Assignment.fromJS(assignment),
  );
}

export default function clients(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'CREATE_SNAPSHOT':
      return state.setIn(['firebase', 'exportingSnapshot'], true);

    case 'SNAPSHOT_CREATED':
      return state.setIn(['firebase', 'exportingSnapshot'], false);

    case 'SNAPSHOT_EXPORT_ERROR':
      return state.setIn(['firebase', 'exportingSnapshot'], false);

    case 'EXPORT_PROJECT':
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'waiting'}),
      );

    case 'PROJECT_EXPORTED':
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'ready', url: action.payload.url}),
      );

    case 'PROJECT_EXPORT_ERROR':
      return state.setIn(
        ['projectExports', action.payload.exportType],
        new Immutable.Map({status: 'error'}),
      );

    case 'UPDATE_COURSES':
      return state.setIn(
        ['courses'],
        new Immutable.List(action.payload.courses),
      );

    case 'ASSIGNMENT_IMPORTED':
      return state.setIn(
        ['assignments', action.payload.assignment.assignmentKey],
        new Assignment(action.payload.assignment),
      );

    case 'ASSIGNMENT_CREATED':
      return state.setIn(
        ['assignments', action.payload.assignmentKey],
        new Assignment({
          courseId: action.payload.assignment.courseId,
          id: action.payload.assignment.id,
          snapshotKey: action.payload.snapshotKey,
          alternateLink: action.payload.assignment.alternateLink,
          assignerId: action.payload.assignerId,
        }),
      );
    case 'ASSIGNMENTS_LOADED':
      return action.payload.reduce(addAssignment, state);
  }

  return state;
}
