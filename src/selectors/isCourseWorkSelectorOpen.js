export default function isCourseWorkSelectorOpen(state) {
  return state.getIn(
    ['ui', 'courseWorkSelector', 'openModal'],
  );
}
