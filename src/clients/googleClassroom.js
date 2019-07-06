import qs from 'qs';

import {AssignmentState} from '../enums';
import {loadAndConfigureGapi} from '../services/gapi';

const BASE_URL = 'https://classroom.google.com/u/0/share?';

export function createShareToClassroomUrl(snapshotKey, title) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `snapshot=${snapshotKey}`;
  return BASE_URL + qs.stringify({url: uri.href, title});
}

export async function getCourses(pageToken) {
  const gapi = await loadAndConfigureGapi();
  const {result} = await gapi.client.classroom.courses.list({pageToken});
  return result;
}

export async function createClassroomAssignment({
  courseId,
  dueDate,
  url,
  title,
  state,
}) {
  const gapi = await loadAndConfigureGapi();

  const newAssignment = await gapi.client.classroom.courses.courseWork.create({
    courseId,
    title,
    workType: AssignmentState.ASSIGNMENT,
    state,
    dueDate: {
      year: dueDate.getUTCFullYear(),
      month: dueDate.getUTCMonth() + 1,
      day: dueDate.getUTCDate(),
    },
    dueTime: {
      hours: dueDate.getUTCHours(),
      minutes: dueDate.getUTCMinutes(),
      seconds: 0,
      nanos: 0,
    },
    materials: {
      link: {
        url,
        title,
        thumbnailUrl: 'N/A',
      },
    },
  });
  return newAssignment.result;
}
