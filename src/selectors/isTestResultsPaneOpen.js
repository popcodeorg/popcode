export default function isTestResultsPaneOpen(state) {
  return state.getIn(['tests', 'isTestResultsPaneOpen']);
}
