export default function isAssignmentExportInProgress(state) {
  return state.getIn(['clients', 'exportingAssignment']);
}
