import Immutable from 'immutable';

import {Assignment} from '../records';

const defaultState = new Immutable.Map();

function addAssignment(state, assignment) {
  return state.setIn(
    [assignment.assignmentKey],
    Assignment.fromJS(assignment),
  );
}

export default function assignments(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'ASSIGNMENT_IMPORTED':
      return state.setIn(
        [action.payload.assignment.assignmentKey],
        new Assignment(action.payload.assignment),
      );

    case 'ASSIGNMENT_CREATED':
      return state.setIn(
        [action.payload.assignmentKey],
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

