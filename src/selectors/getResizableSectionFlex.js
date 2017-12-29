export default function getFlex(state, section) {
  return state.getIn(['ui', 'workspace', section, 'flex']).toJS();
}
