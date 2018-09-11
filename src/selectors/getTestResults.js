export default function getTestResults(state) {
  return state.getIn(['tests', 'testResults']);
}
