export default function isGapiReady(state) {
  return state.getIn(['clients', 'gapi', 'ready']);
}
