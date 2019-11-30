export default function getCurrentCompiledProjectKey(state) {
  return state.get('compiledProjects').last()?.compiledProjectKey;
}
