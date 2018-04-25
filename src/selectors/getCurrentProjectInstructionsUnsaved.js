export default function getCurrentProjectinstructionsUnsaved(state) {
  return state.getIn(['ui', 'workspace', 'draftInstructions']);
}
