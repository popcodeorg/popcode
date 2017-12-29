export default function isDraggingDivider(state, section) {
  return state.getIn(['ui', 'workspace', section, 'isDraggingDivider']);
}
