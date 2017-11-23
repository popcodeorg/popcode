const BASE_URL = 'https://classroom.google.com/u/0/share?url=';

export function createShareToClassroomUrl(snapshotKey) {
  const uri = document.createElement('a');
  uri.setAttribute('href', '/');
  uri.search = `snapshot=${snapshotKey}`;
  const classroomShareUrl = BASE_URL + uri.href;
  return classroomShareUrl;
}
