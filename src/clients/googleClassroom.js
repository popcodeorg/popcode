import {
  initGapi,
  initGapiClient,
  authenticateGapiClient,
} from '../services/gapi';

export function createSnapshotUrl(snapshotKey) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `snapshot=${snapshotKey}`;
  return uri.href;
}

export function createAssignmentUrl(assignemtnKey) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `assignment=${assignemtnKey}`;
  return uri.href;
}

export async function getCourses(accessToken) {
  const gapi = await initGapi();
  const unauthorizedClient = await initGapiClient(gapi);
  const client = authenticateGapiClient(unauthorizedClient, accessToken);
  const courses = await client.classroom.courses.list();
  return courses.result.courses;
}

export async function createClassroomAssignment(
  accessToken,
  workType,
  courseId,
  selectedDate,
  url,
  title,
) {
  const gapi = await initGapi();
  const unautherizedClient = await initGapiClient(gapi);
  const client = authenticateGapiClient(unautherizedClient, accessToken);
  const date = selectedDate.split('-');
  const newAssignment = await client.classroom.courses.courseWork.create({
    courseId,
    title,
    workType,
    state: 'PUBLISHED',
    dueDate: {
      year: date[0],
      month: date[1],
      day: date[2],
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
  return newAssignment.result;
}

export async function submitClassroomAssignment(
  accessToken,
  courseId,
  courseWorkId,
  snapshotUrl,
) {
  const gapi = await initGapi();
  const unautherizedClient = await initGapiClient(gapi);
  const client = authenticateGapiClient(unautherizedClient, accessToken);
  const {result: {studentSubmissions: [submission]}} =
    await client.classroom.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId,
      userId: 'me',
    });
  // ADD handler if no assignments in array
  await client.classroom.courses.courseWork.studentSubmissions.modifyAttachments({
    courseId,
    courseWorkId,
    id: submission.id,
    addAttachments: [
      {
        link: {
          url: snapshotUrl,
        },
      },
    ],
  });

  await client.classroom.courses.courseWork.studentSubmissions.turnIn({
    courseId,
    courseWorkId,
    id: submission.id,
  });
}
