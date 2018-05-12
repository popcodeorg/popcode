export default function getRequestedFocusedLine(state) {
  const requestedFocusedLine =
    state.getIn(['ui', 'requestedFocusedLine']);
  if (requestedFocusedLine) {
    return requestedFocusedLine.toJS();
  }
  return null;
}
