export default function getFocusedSelector(state) {
  return state.getIn(['ui', 'editors', 'focusedSelector']);
}
