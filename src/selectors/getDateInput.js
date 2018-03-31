export default function getDateInput(state) {
  return state.getIn(
    ['ui', 'assignmentSelector', 'dateInput'],
  );
}
