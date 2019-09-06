import {createSelector} from 'reselect';

import partition from 'lodash-es/partition';

import getAllProjects from './getAllProjects';

export default createSelector(
  [getAllProjects],
  projects => partition(projects, {isArchived: false}),
);
