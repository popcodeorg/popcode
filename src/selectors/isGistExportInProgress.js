export default function isGistExportInProgress(state) {
  return state.getIn(
    ['clients', 'projectExports', 'gist', 'status'],
  ) === 'waiting';
}
