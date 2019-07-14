import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {call} from 'redux-saga/effects';

import {
  openAssignmentCreator as openAssignmentCreatorSaga,
  createAssignment as createAssignmentSaga,
} from '../../../src/sagas/assignments';
import {
  getCourses,
  createClassroomAssignment,
} from '../../../src/clients/googleClassroom';
import {createProjectSnapshot} from '../../../src/clients/firebase';
import {
  assignmentCreated,
  assignmentNotCreated,
} from '../../../src/actions/assignments';
import {coursesLoaded, coursesFullyLoaded} from '../../../src/actions/ui';
import {getCourse, getCurrentProject} from '../../../src/selectors';
import {generateTextPreview} from '../../../src/util/compileProject';
import {createSnapshotUrl} from '../../../src/util/exportUrls';
import Scenario from '../../helpers/Scenario';
import {course} from '../../helpers/factory';

test('openAssignmentCreator', assert => {
  let pageToken, nextPageToken;
  const courses = [course()];
  testSaga(openAssignmentCreatorSaga)
    .next()
    .call(getCourses, pageToken)
    .next({courses, nextPageToken})
    .put(coursesLoaded(courses))
    .next()
    .put(coursesFullyLoaded())
    .next()
    .isDone();
  assert.end();
});

test('createAssignmentSaga', t => {
  const {project} = new Scenario();
  const snapshotKey = '123-456';
  const url =
    'http://localhost:3001/?snapshot=54a8a2a0-d2f2-427e-95d6-f58ec371673f';
  const title = 'Page Title';
  const selectedCourseId = '10800902048';
  const dueDate = Date.now();

  t.test('plublished', assert => {
    const assignmentState = 'PUBLISHED';
    const assignment = {
      alternateLink: 'test',
    };
    testSaga(createAssignmentSaga, {
      payload: {
        selectedCourseId,
        dueDate,
        assignmentState,
      },
    })
      .next()
      .select(getCurrentProject)
      .next(project.toJS())
      .call(createProjectSnapshot, project.toJS())
      .next(snapshotKey)
      .all([
        call(createSnapshotUrl, snapshotKey),
        call(generateTextPreview, project.toJS()),
      ])
      .next([url, title])
      .call(createClassroomAssignment, {
        courseId: selectedCourseId,
        dueDate,
        state: assignmentState,
        title,
        url,
      })
      .next(assignment)
      .put(
        assignmentCreated({
          url: assignment.alternateLink,
          exportType: 'assignment',
        }),
      )
      .next()
      .isDone();
    assert.end();
  });

  t.test('draft', assert => {
    const assignmentState = 'DRAFT';
    const assignment = {};
    testSaga(createAssignmentSaga, {
      payload: {
        selectedCourseId,
        dueDate,
        assignmentState,
      },
    })
      .next()
      .select(getCurrentProject)
      .next(project.toJS())
      .call(createProjectSnapshot, project.toJS())
      .next(snapshotKey)
      .all([
        call(createSnapshotUrl, snapshotKey),
        call(generateTextPreview, project.toJS()),
      ])
      .next([url, title])
      .call(createClassroomAssignment, {
        courseId: selectedCourseId,
        dueDate,
        state: assignmentState,
        title,
        url,
      })
      .next(assignment)
      .select(getCourse, selectedCourseId)
      .next(course())
      .put(
        assignmentCreated({
          url: course().alternateLink,
          exportType: 'assignment-draft',
        }),
      )
      .next()
      .isDone();
    assert.end();
  });
  t.test('not-created', assert => {
    const assignmentState = 'DRAFT';
    testSaga(createAssignmentSaga, {
      payload: {
        selectedCourseId,
        dueDate,
        assignmentState,
      },
    })
      .next()
      .select(getCurrentProject)
      .next(project.toJS())
      .call(createProjectSnapshot, project.toJS())
      .next(snapshotKey)
      .all([
        call(createSnapshotUrl, snapshotKey),
        call(generateTextPreview, project.toJS()),
      ])
      .next([url, title])
      .call(createClassroomAssignment, {
        courseId: selectedCourseId,
        dueDate,
        state: assignmentState,
        title,
        url,
      })
      .next()
      .put(assignmentNotCreated())
      .next()
      .isDone();
    assert.end();
  });
});
