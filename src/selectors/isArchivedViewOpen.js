export default function isArchivedViewOpen(state) {
  return state.getIn(['ui', 'archivedViewOpen']);
}
