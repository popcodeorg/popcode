export default function getDividerRefs(state, section) {
  return state.getIn(['ui', 'workspace', section, 'dividerRefs']).toJS();
}
