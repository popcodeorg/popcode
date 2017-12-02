import qs from 'qs';

const BASE_URL = 'https://classroom.google.com/u/0/share?';

export function createShareToClassroomUrl(snapshotKey) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `snapshot=${snapshotKey}`;
  return BASE_URL + qs.stringify({url: uri.href});
}
