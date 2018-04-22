export default function getCurrentProjectinstructionsUnsaved(state) {
  return state.getIn(['ui', 'workspace', 'displayedInstructions']);
}
