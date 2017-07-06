import {Map} from 'immutable';
import FirebasePersistor from '../persistors/FirebasePersistor';
import {getCurrentProject} from '../selectors';

export function getProjectKeys(state) {
  return Array.from(state.get('projects').keys());
}

export function isPristineProject(project) {
  if (Map.isMap(project)) {
    return !project.has('updatedAt');
  }
  return !('updatedAt' in project);
}

export function saveCurrentProject(state) {
  const currentProject = getCurrentProject(state);
  const persistor = getCurrentPersistor(state);

  if (persistor && currentProject && !isPristineProject(currentProject)) {
    persistor.saveCurrentProject(currentProject);
    return true;
  }

  return false;
}

function getCurrentPersistor(state) {
  const currentUser = state.get('user');
  if (currentUser.get('authenticated')) {
    return new FirebasePersistor(currentUser.get('id'));
  }
  return null;
}
