export default function isExperimental(state) {
  return state.getIn(['ui', 'experimental']);
}
