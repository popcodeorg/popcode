import {Map} from 'immutable';

export function getProjectKeys(state) {
  return Array.from(state.projects.keys());
}

export function getCurrentProject(state) {
  const projectKey = state.currentProject.get('projectKey');
  if (projectKey) {
    return state.projects.get(projectKey).toJS();
  }
  return null;
}

export function isPristineProject(project) {
  if (Map.isMap(project)) {
    return !project.has('updatedAt');
  }
  return !('updatedAt' in project);
}
