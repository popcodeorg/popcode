import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import uuid from 'uuid/v4';
import {
  createGistFromProject,
  createRepoFromProject,
} from '../clients/github';
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
  snapshotCreated,
  snapshotExportError,
  projectExported,
  projectExportError,
  updateCourses,
  assignmentSubmitted,
} from '../actions/clients';
import {
  assignmentSelectorOpened,
  assignmentSelectorClosed,
  // assignmentUpdated,
} from '../actions/ui';
import {
  getCurrentProject,
  getCurrentAssignment,
  getCurrentAssignmentKey,
} from '../selectors';
import {generateTextPreview} from '../util/compileProject';

export function* createSnapshot() {
  const project = yield select(getCurrentProject);
  try {
    const snapshotKey = yield call(createProjectSnapshot, project);
    yield put(snapshotCreated(snapshotKey));
  } catch (e) {
    yield put(snapshotExportError(e));
  }
}

export function* exportProject({payload: {exportType}}) {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  let url;

  try {
    if (exportType === 'gist') {
      ({html_url: url} = yield call(createGistFromProject, project, user));
    } else if (exportType === 'repo') {
      ({html_url: url} = yield call(createRepoFromProject, project, user));
    }
    yield put(projectExported(url, exportType));
  } catch (e) {
    yield put(projectExportError(exportType));
  }
}

export function* openAssignmentSelector() {
  const state = yield select();
  const user = state.get('user').toJS();
  const courses = yield call(getCourses, user.accessTokens['google.com']);
  yield put(updateCourses(courses));
  yield put(assignmentSelectorOpened());
}

export function* createAssignment({payload: {type, projectKey, selectedCourse, selectedDate}}) {
  const state = yield select();
  const user = state.get('user').toJS();
  const project = getCurrentProject(state);
  const projectTitle = yield call(generateTextPreview, project);
  const assignmentKey = uuid().toString();
  const assignmentUrl = yield call(createAssignmentUrl, assignmentKey);
  const assignment = yield call(
    createClassroomAssignment,
    user.accessTokens['google.com'],
    type,
    selectedCourse,
    selectedDate,
    assignmentUrl,
    projectTitle,
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
    assignmentCreated(projectKey, assignmentKey, snapshotKey, assignment, user.id),
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
  // yield put(assignmentUpdated());
}

export default function* () {
  yield all([
    takeEvery('CREATE_SNAPSHOT', createSnapshot),
    takeEvery('EXPORT_PROJECT', exportProject),
    takeEvery('OPEN_ASSIGNMENT_SELECTOR', openAssignmentSelector),
    takeEvery('CREATE_ASSIGNMENT', createAssignment),
    takeEvery('SUBMIT_ASSIGNMENT', submitAssignment),
    takeEvery('UPDATE_ASSIGNMENT', updateAssignment),
  ]);
}
