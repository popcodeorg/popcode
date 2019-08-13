export default function getCourses(state) {
  return state.getIn(['googleClassroom', 'courses', 'items']);
}
