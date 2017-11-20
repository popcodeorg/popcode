export default function getFocusedEditors(state) {
  return state.getIn(['ui', 'editors', 'focusedEditors']).toJS();
}
