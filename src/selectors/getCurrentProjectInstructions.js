import {createSelector} from 'reselect';

import getCurrentProjectKey from './getCurrentProjectKey';
import getProjects from './getProjects';

export default createSelector(
  [getCurrentProjectKey, getProjects],
  (projectKey, projects) =>
    projectKey ? projects.getIn([projectKey, 'instructions']) : '',
);
