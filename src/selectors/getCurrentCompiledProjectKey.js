import get from 'lodash/get';

export default function getCurrentCompiledProjectKey(state) {
  return get(
    state.get('compiledProjects').last(),
    'compiledProjectKey',
  );
}
