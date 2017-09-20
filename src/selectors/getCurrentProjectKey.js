export default function getCurrentProjectKey(state) {
  return state.getIn(['currentProject', 'projectKey']);
}
