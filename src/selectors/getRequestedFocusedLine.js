export default function(state) {
  const requestedFocusedLine =
    state.getIn(['ui', 'editors', 'requestedFocusedLine']);
  if (requestedFocusedLine) {
    return requestedFocusedLine.toJS();
  }
  return null;
}
