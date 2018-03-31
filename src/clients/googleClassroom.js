import {
  getGapi,
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

export async function getCourses() {
  const gapi = await getGapi();
  const courses = await gapi.client.classroom.courses.list();
  return courses.result.courses;
}

export async function createClassroomAssignment(
  accessToken,
  workType,
  courseId,
  selectedDate,
  url,
  title,
  assignmentState,
) {
  const gapi = await getGapi();
  const newAssignment = await gapi.client.classroom.courses.courseWork.create({
    courseId,
    title,
    workType,
    state: assignmentState,
    dueDate: {
      year: selectedDate.getUTCFullYear(),
      month: selectedDate.getUTCMonth() + 1,
      day: selectedDate.getUTCDate(),
    },
    dueTime: {
      hours: selectedDate.getUTCHours(),
      minutes: selectedDate.getUTCMinutes(),
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
  const gapi = await getGapi();
  const {result: {studentSubmissions: [submission]}} =
    await gapi.client.classroom.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId,
      userId: 'me',
    });
  // ADD handler if no assignments in array
  await gapi.client.classroom.courses.courseWork.
    studentSubmissions.modifyAttachments({
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

  await gapi.client.classroom.courses.courseWork.studentSubmissions.turnIn({
    courseId,
    courseWorkId,
    id: submission.id,
  });
}
