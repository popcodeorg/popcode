export default function getOpenTopBarMenu(state) {
  return state.getIn(['ui', 'topBar', 'openMenu']);
}
