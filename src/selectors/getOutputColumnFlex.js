export default function getOutputColumnFlex(state) {
  return state.getIn(['ui', 'workspace', 'outputColumnFlex']).toJS();
}
