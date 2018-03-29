export default function getAssignments(state) {
  const assignments = state.getIn(['clients', 'assignments']);
  if (assignments) {
    return assignments;
  }
  return null;
}
