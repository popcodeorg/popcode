export default function isProjectExportInProgress(state, exportKey) {
  return state.getIn(
    ['clients', 'projectExports', exportKey, 'status'],
  ) === 'waiting';
}
