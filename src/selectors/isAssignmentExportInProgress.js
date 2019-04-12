export default function isAssignmentExportInProgress(state) {
  return state.getIn([
    'googleClassroom',
    'exportingAssignment',
  ]);
}
