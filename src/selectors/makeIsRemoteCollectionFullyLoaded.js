export default function makeIsRemoteCollectionFullyLoaded(statePath) {
  return function isRemoteCollectionFullyLoaded(state) {
    const {isFullyLoaded} = state.getIn(statePath);
    return isFullyLoaded;
  };
}
