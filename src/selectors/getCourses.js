export default function getCourses(state) {
  const courses = state.getIn(['ui', 'assignmentSelector', 'courses']);
  if (courses) {
    return courses.toJS();
  }
  return null;
}
