export default function getConsoleHistory(state) {
  return state.getIn(['console', 'history']);
}
