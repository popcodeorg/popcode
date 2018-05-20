import {Map} from 'immutable';

export function getProjectKeys(state) {
  return Array.from(state.get('projects').keys());
}

export function isPristineProject(project) {
  if (Map.isMap(project)) {
    return !project.get('updatedAt');
  }
  return !project.updatedAt;
}
