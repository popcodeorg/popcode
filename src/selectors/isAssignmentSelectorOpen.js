export default function isAssignmentSelectorOpen(state) {
  return state.getIn(
    ['ui', 'assignmentSelector', 'openModal'],
  );
}
