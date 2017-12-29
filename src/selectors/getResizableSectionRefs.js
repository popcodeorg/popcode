export default function getResizableSectionRefs(state, section) {
  return state.getIn(['ui', 'workspace', section, 'refs']).toJS();
}
