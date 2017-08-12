import {createSelector} from 'reselect';
import getCurrentProjectKey from './getCurrentProjectKey';

function getProjects(state) {
  return state.get('projects');
}

export default createSelector(
  [getCurrentProjectKey, getProjects],
  (projectKey, projects) => {
    if (projectKey) {
      return projects.get(projectKey).toJS();
    }
    return null;
  },
);
