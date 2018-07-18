export default function isUserTyping(state) {
  return state.getIn(['ui', 'isTyping']);
}
