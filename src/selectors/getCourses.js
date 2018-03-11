export default function getCourses(state) {
  const courses = state.getIn(['clients', 'courses']);
  if (courses) {
    return courses.toJS();
  }
  return null;
}
