import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import uuid from 'uuid/v4';

import {
  getCourses,
  createClassroomAssignment,
  createSnapshotUrl,
  createAssignmentUrl,
  submitClassroomAssignment,
} from '../clients/googleClassroom';
import {
  createProjectSnapshot,
  createProjectAssignment,
  updateAssignmentSnapshot,
} from '../clients/firebase';
import {
  assignmentCreated,
  assignmentSubmitted,
  assignmentUpdated,
} from '../actions/assignments';
import {
  assignmentSelectorOpened,
  assignmentSelectorClosed,
  updateCourses,
} from '../actions/ui';
import {
  getCurrentProject,
  getCurrentAssignment,
  getCurrentAssignmentKey,
} from '../selectors';
import {generateTextPreview} from '../util/compileProject';

export function* openAssignmentSelector() {
  const courses = yield call(getCourses);
  yield put(updateCourses(courses));
  yield put(assignmentSelectorOpened());
}

export function* assignAssignment(
  {payload: {projectKey, selectedCourse, selectedDate}}) {
  yield createAssignment(
    projectKey,
    selectedCourse,
    selectedDate,
    'PUBLISHED',
  );
}

export function* draftAssignment(
  {payload: {projectKey, selectedCourse, selectedDate}}) {
  yield createAssignment(projectKey, selectedCourse, selectedDate, 'DRAFT');
}

export function* createAssignment(
  projectKey, selectedCourse, selectedDate, assignmentState) {
  const state = yield select();
  const user = state.get('user').toJS();
  const project = getCurrentProject(state);
  const projectTitle = yield call(generateTextPreview, project);
  const assignmentKey = uuid().toString();
  const assignmentUrl = yield call(createAssignmentUrl, assignmentKey);
  const assignment = yield call(
    createClassroomAssignment,
    user.accessTokens['google.com'],
    'ASSIGNMENT',
    selectedCourse,
    selectedDate,
    assignmentUrl,
    projectTitle,
    assignmentState,
  );
  const snapshotKey = yield call(createProjectSnapshot, project);
  yield call(
    createProjectAssignment,
    assignmentKey,
    snapshotKey,
    assignment,
    user.id,
  );
  yield put(
    assignmentCreated(
      projectKey,
      assignmentKey,
      snapshotKey,
      assignment,
      user.id,
      assignmentState,
    ),
  );
  yield put(assignmentSelectorClosed());
}

export function* submitAssignment() {
  const state = yield select();
  const user = state.get('user').toJS();
  const assignment = getCurrentAssignment(state);
  const project = getCurrentProject(state);
  const snapshotKey = yield call(createProjectSnapshot, project);
  const snapshotUrl = yield call(createSnapshotUrl, snapshotKey);
  yield call(
    submitClassroomAssignment,
    user.accessTokens['google.com'],
    assignment.courseId,
    assignment.id,
    snapshotUrl,
  );
  yield put(assignmentSubmitted(assignment));
}

export function* updateAssignment() {
  const state = yield select();
  const assignmentKey = getCurrentAssignmentKey(state);
  const project = getCurrentProject(state);
  const snapshotKey = yield call(createProjectSnapshot, project);
  yield call(updateAssignmentSnapshot, assignmentKey, snapshotKey);
  yield put(assignmentUpdated());
}

export default function* () {
  yield all([
    takeEvery('OPEN_ASSIGNMENT_SELECTOR', openAssignmentSelector),
    takeEvery('ASSIGN_ASSIGNMENT', assignAssignment),
    takeEvery('DRAFT_ASSIGNMENT', draftAssignment),
    takeEvery('SUBMIT_ASSIGNMENT', submitAssignment),
    takeEvery('UPDATE_ASSIGNMENT', updateAssignment),
  ]);
}
