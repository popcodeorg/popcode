import {createSelector} from 'reselect';
import get from 'lodash/get';
import getCurrentProject from './getCurrentProject';
import getCurrentUser from './getCurrentUser';

export default createSelector(
  [getCurrentProject, getCurrentUser],
  (currentProject, currentUser) =>
    currentProject ? get(currentProject,
      ['externalLocations', 'githubRepos', currentUser.githubUsername],
      null,
    ) : null,
);
