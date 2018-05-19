export default function isDraggingColumnDivider(state) {
  return state.getIn(['ui', 'workspace', 'isDraggingColumnDivider']);
}
