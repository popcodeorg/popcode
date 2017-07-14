export default function isSnapshotInProgress(state) {
  return state.getIn(['clients', 'firebase', 'waitingForSnapshot']);
}
