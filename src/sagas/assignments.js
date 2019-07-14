import {all, call, put, select, takeEvery} from 'redux-saga/effects';

import {
  getCourses,
  createClassroomAssignment,
} from '../clients/googleClassroom';
import {createProjectSnapshot} from '../clients/firebase';
import {assignmentCreated, assignmentNotCreated} from '../actions/assignments';
import {coursesLoaded, coursesFullyLoaded} from '../actions/ui';
import {getCourse, getCurrentProject} from '../selectors';
import {generateTextPreview} from '../util/compileProject';
import {createSnapshotUrl} from '../util/exportUrls';

export function* openAssignmentCreator() {
  let pageToken;
  do {
    const {courses, nextPageToken} = yield call(getCourses, pageToken);
    yield put(coursesLoaded(courses));
    pageToken = nextPageToken;
  } while (pageToken);
  yield put(coursesFullyLoaded());
}

export function* createAssignment({
  payload: {selectedCourseId, dueDate, assignmentState},
}) {
  const project = yield select(getCurrentProject);
  const snapshotKey = yield call(createProjectSnapshot, project);
  const [url, title] = yield all([
    call(createSnapshotUrl, snapshotKey),
    call(generateTextPreview, project),
  ]);
  const assignmentData = {
    courseId: selectedCourseId,
    dueDate,
    url,
    title,
    state: assignmentState,
  };
  try {
    const assignment = yield call(createClassroomAssignment, assignmentData);
    if (assignment.alternateLink) {
      yield put(
        assignmentCreated({
          url: assignment.alternateLink,
          exportType: 'assignment',
        }),
      );
    } else {
      const course = yield select(getCourse, selectedCourseId);
      yield put(
        assignmentCreated({
          url: course.alternateLink,
          exportType: 'assignment-draft',
        }),
      );
    }
  } catch (e) {
    yield put(assignmentNotCreated());
  }
}

export default function* assignments() {
  yield all([
    takeEvery('OPEN_ASSIGNMENT_CREATOR', openAssignmentCreator),
    takeEvery('CREATE_ASSIGNMENT', createAssignment),
  ]);
}
