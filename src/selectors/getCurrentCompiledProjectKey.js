import get from 'lodash-es/get';

export default function getCurrentCompiledProjectKey(state) {
  return get(
    state.get('compiledProjects').last(),
    'compiledProjectKey',
  );
}
