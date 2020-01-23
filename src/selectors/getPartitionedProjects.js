import partition from 'lodash-es/partition';

import {createSelector} from 'reselect';

import getAllProjects from './getAllProjects';

export default createSelector([getAllProjects], projects =>
  partition(projects, 'isArchived'),
);
