export default function isGistExportInProgress(state) {
  return state.getIn(
    ['clients', 'gists', 'lastExport', 'status'],
  ) === 'waiting';
}
