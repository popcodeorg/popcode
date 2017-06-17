export default function isDashboardOpen(state) {
  return state.getIn(['ui', 'dashboard', 'isOpen']);
}
