export default function getSelectedCourse(state) {
  return state.getIn(
    ['ui', 'assignmentSelector', 'selectedCourse'],
  );
}
