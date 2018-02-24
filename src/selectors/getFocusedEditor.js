export default function getFocusedEditor(state) {
  return state.getIn(['ui', 'editors', 'focusedEditor']);
}
