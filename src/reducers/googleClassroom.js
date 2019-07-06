import {Course, GoogleClassroom, RemoteCollection} from '../records';

const defaultState = new GoogleClassroom();

function addCourse(state, course) {
  return state.setIn(['courses', 'items', course.id], new Course(course));
}

export default function googleClassroom(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'COURSES_LOADED':
      return action.payload.courses.reduce(addCourse, state);

    case 'COURSES_FULLY_LOADED':
      return state.setIn(['courses', 'isFullyLoaded'], true);

    case 'LOG_OUT':
      return state.setIn(['courses'], new RemoteCollection());

    default:
      return state;
  }
}
