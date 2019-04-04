export default function isLoginPromptOpen(state) {
  return state.getIn(['ui', 'isLoginPromptOpen']);
}
