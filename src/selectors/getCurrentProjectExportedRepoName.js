import get from 'lodash-es/get';
import {createSelector} from 'reselect';

import getCurrentProject from './getCurrentProject';

export default createSelector([getCurrentProject], currentProject =>
  currentProject
    ? get(currentProject, ['externalLocations', 'githubRepoName'], null)
    : null,
);
