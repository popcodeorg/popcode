export default function getOutputColumnFlex(state) {
  return state.getIn(['ui', 'workspace', 'output', 'flex']).toJS();
}
