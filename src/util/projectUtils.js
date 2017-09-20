import {Map} from 'immutable';
import {
  saveCurrentProject as saveCurrentProjectToFirebase,
} from '../clients/firebase';
import {getCurrentProject, getCurrentUserId} from '../selectors';

export function getProjectKeys(state) {
  return Array.from(state.get('projects').keys());
}

export function isPristineProject(project) {
  if (Map.isMap(project)) {
    return !project.get('updatedAt');
  }
  return !project.updatedAt;
}

export function saveCurrentProject(state) {
  const userId = getCurrentUserId(state);
  const currentProject = getCurrentProject(state);

  if (userId && currentProject && !isPristineProject(currentProject)) {
    saveCurrentProjectToFirebase(userId, currentProject);
    return true;
  }

  return false;
}
