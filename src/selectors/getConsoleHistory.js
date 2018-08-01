export function getConsoleHistory(state) {
  return state.get('console').history;
}

export function getPreviousConsoleInput(state) {
  return state.get('console').previousConsoleInput;
}

export function getPreviousHistoryIndex(state) {
  return state.get('console').previousHistoryIndex;
}
