export default function isProjectExportInProgress(state) {
  return state.getIn(
    ['clients', 'projects', 'lastExport', 'status'],
  ) === 'waiting';
}
