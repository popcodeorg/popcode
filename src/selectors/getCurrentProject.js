import {createSelector} from 'reselect';

import getCurrentProjectKey from './getCurrentProjectKey';
import getProjects from './getProjects';

export default createSelector(
  [getCurrentProjectKey, getProjects],
  (projectKey, projects) => {
    if (projectKey) {
      return projects.get(projectKey).toJS();
    }
    return null;
  },
);
