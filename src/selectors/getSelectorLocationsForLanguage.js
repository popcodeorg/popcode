export default function getSelectorLocationsForLanguage(state, language) {
  return state.getIn([
    'selectorLocations',
    'selectors',
  ])[language];
}
