import {Map} from 'immutable';

export function getProjectKeys(state) {
  return Array.from(state.get('projects').keys());
}

export function getCurrentProject(state) {
  const projectKey = state.getIn(['currentProject', 'projectKey']);
  if (projectKey) {
    return state.getIn(['projects', projectKey]).toJS();
  }
  return null;
}

export function isPristineProject(project) {
  if (Map.isMap(project)) {
    return !project.has('updatedAt');
  }
  return !('updatedAt' in project);
}
