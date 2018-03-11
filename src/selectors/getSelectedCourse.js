export default function getSelectedCourse(state) {
  return state.getIn(
    ['ui', 'courseWorkSelector', 'selectedCourse'],
  );
}
