export default function isSaveIndicatorShown(state) {
  return state.getIn(['ui', 'saveIndicatorShown']);
}
