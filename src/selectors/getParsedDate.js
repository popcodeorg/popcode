export default function getParsedDate(state) {
  return state.getIn(
    ['ui', 'assignmentSelector', 'parsedDate'],
  );
}
