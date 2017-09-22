export default function getHighlighterSelector(state) {
  return state.getIn(['ui', 'editors', 'highlighterSelector']);
}
