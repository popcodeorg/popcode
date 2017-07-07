export default function getLastRefreshTimestamp(state) {
  return state.getIn(['ui', 'lastRefreshTimestamp']);
}
