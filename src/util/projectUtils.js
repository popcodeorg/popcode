import toArray from 'lodash/toArray';

export function getProjectKeys(state) {
  return toArray(state.projects.keys());
}

export function getCurrentProject(state) {
  const projectKey = state.currentProject.get('projectKey');
  if (projectKey) {
    return state.projects.get(projectKey).toJS();
  }
  return null;
}
