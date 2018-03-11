import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {
  createGistFromProject,
  createRepoFromProject,
} from '../clients/github';
import {
  createShareToClassroomUrl,
  getCourses,
  createClassroomCourseWork,
  createSnapshotUrl,
  submitClassroomAssignment,
} from '../clients/googleClassroom';
import {
  createProjectSnapshot,
  addAssignmentToSnapshot,
} from '../clients/firebase';
import {
  courseWorkCreated,
  snapshotCreated,
  snapshotExportError,
  projectExported,
  projectExportError,
  updateCourses,
  assignmentSubmitted,
} from '../actions/clients';
import {
  courseWorkSelectorOpened,
  courseWorkSelectorClosed,
} from '../actions/ui';
import {getCurrentProject, getAssignment} from '../selectors';
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
    } else if (exportType === 'classroom') {
      const snapshotKey = yield call(createProjectSnapshot, project);
      const projectTitle = yield call(generateTextPreview, project);
      url = yield call(createShareToClassroomUrl, snapshotKey, projectTitle);
    }
    yield put(projectExported(url, exportType));
  } catch (e) {
    yield put(projectExportError(exportType));
  }
}

export function* openCourseWorkSelector() {
  const state = yield select();
  const user = state.get('user').toJS();
  const courses = yield call(getCourses, user.accessTokens['google.com']);
  yield put(updateCourses(courses));
  yield put(courseWorkSelectorOpened());
}

export function* createCourseWork({payload: {type, selectedCourse}}) {
  const state = yield select();
  const user = state.get('user').toJS();
  const project = getCurrentProject(state);
  const projectTitle = yield call(generateTextPreview, project);
  const snapshotKey = yield call(createProjectSnapshot, project);
  const snapshotUrl = yield call(createSnapshotUrl, snapshotKey);
  const courseWork = yield call(
    createClassroomCourseWork,
    user.accessTokens['google.com'],
    type,
    selectedCourse,
    snapshotUrl,
    projectTitle,
  );
  yield call(addAssignmentToSnapshot, snapshotKey, courseWork);
  yield put(courseWorkCreated(courseWork));
  yield put(courseWorkSelectorClosed());
}

export function* submitAssignment() {
  const state = yield select();
  const user = state.get('user').toJS();
  const assignment = getAssignment(state);
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


export default function* () {
  yield all([
    takeEvery('CREATE_SNAPSHOT', createSnapshot),
    takeEvery('EXPORT_PROJECT', exportProject),
    takeEvery('OPEN_COURSE_WORK_SELECTOR', openCourseWorkSelector),
    takeEvery('CREATE_COURSE_WORK', createCourseWork),
    takeEvery('SUBMIT_ASSIGNMENT', submitAssignment),
  ]);
}
