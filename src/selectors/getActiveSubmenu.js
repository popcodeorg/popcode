export default function getActiveSubmenu(state) {
  return state.getIn(['ui', 'dashboard', 'activeSubmenu']);
}
