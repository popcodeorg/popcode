export default function isRepoExportInProgress(state) {
  return state.getIn(
    ['clients', 'projectExports', 'repo', 'status'],
  ) === 'waiting';
}
