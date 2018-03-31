export default function getAssignments(state) {
  const assignments = state.getIn(['assignments']);
  if (assignments) {
    return assignments;
  }
  return null;
}
