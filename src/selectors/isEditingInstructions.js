export default function isEditingInstructions(state) {
  return state.getIn(['ui', 'workspace', 'isEditingInstructions']);
}
