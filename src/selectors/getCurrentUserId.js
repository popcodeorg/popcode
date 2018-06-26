export default function getCurrentUserId(state) {
  return state.getIn(['user', 'account', 'id']);
}
