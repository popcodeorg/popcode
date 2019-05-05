export function createSnapshotUrl(snapshotKey) {
  const uri = document.createElement('a');
  uri.href = '/';
  uri.search = `snapshot=${snapshotKey}`;
  return uri.href;
}
