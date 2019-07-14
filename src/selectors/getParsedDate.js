export default function getParsedDate(state) {
  const date = state.getIn(['form', 'assignmentCreator', 'values', 'date']);
  if (date) {
    return date.parsedDate;
  }
  return null;
}
