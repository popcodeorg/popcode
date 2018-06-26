export default function getCurrentUser(state) {
  return state.getIn(['user', 'account']);
}
