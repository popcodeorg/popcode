export default function getShouldRunTests(state) {
  return state.getIn(['tests', 'shouldRunTests']);
}
