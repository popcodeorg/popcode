export default function isClassroomExportInProgress(state) {
  return state.getIn(
    ['clients', 'projectExports', 'classroom', 'status'],
  ) === 'waiting';
}
