export default function getCurrentConsoleInputValue(state) {
  return state.getIn(['console', 'currentInputValue']);
}
