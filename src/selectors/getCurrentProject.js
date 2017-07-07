import {createSelector} from 'reselect';

function getCurrentProjectKey(state) {
  return state.getIn(['currentProject', 'projectKey']);
}

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
