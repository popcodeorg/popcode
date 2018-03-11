import qs from 'qs';
import {
  initGapi,
  initGapiClient,
  initGapiClientClassroom,
} from '../services/gapi';

const BASE_URL = 'https://classroom.google.com/u/0/share?';

export function createShareToClassroomUrl(snapshotKey, title) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `snapshot=${snapshotKey}`;
  return BASE_URL + qs.stringify({url: uri.href, title});
}

export function createSnapshotUrl(assignemtnKey) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `snapshot=${assignemtnKey}`;
  return uri.href;
}

export async function getCourses(accessToken) {
  const gapi = await initGapi();
  const client = await initGapiClient(gapi);
  const classroom = await initGapiClientClassroom(client, accessToken);
  const courses = await classroom.courses.list();
  return courses.result.courses;
}

export async function createClassroomCourseWork(
  accessToken,
  workType,
  courseId,
  url,
  title,
) {
  const gapi = await initGapi();
  const client = await initGapiClient(gapi);
  const classroom = await initGapiClientClassroom(client, accessToken);
  const newCoursework = await classroom.courses.courseWork.create({
    courseId,
    title,
    workType,
    state: 'PUBLISHED',
    dueDate: {
      year: 2018,
      month: 3,
      day: 28,
    },
    dueTime: {
      hours: 23,
      minutes: 59,
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
  return newCoursework.result;
}

export async function submitClassroomAssignment(
  accessToken,
  courseId,
  courseWorkId,
  snapshotUrl,
) {
  const gapi = await initGapi();
  const client = await initGapiClient(gapi);
  const classroom = await initGapiClientClassroom(client, accessToken);
  const submissions =
    await classroom.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId,
      userId: 'me',
    });
  await classroom.courses.courseWork.studentSubmissions.modifyAttachments({
    courseId,
    courseWorkId,
    id: submissions.result.studentSubmissions[0].id,
    addAttachments: [
      {
        link: {
          url: snapshotUrl,
        },
      },
    ],
  });

  await classroom.courses.courseWork.studentSubmissions.turnIn({
    courseId,
    courseWorkId,
    id: submissions.result.studentSubmissions[0].id,
  });
}
