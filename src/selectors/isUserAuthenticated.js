export default function isUserAuthenticated(state) {
  return state.getIn(['user', 'authenticated']);
}
