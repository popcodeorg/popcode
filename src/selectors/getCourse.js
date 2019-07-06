export default function getCourse(state, courseId) {
  const course = state.getIn(['googleClassroom', 'courses', 'items', courseId]);
  return course;
}
