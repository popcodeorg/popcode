import {createSelector} from 'reselect';
import get from 'lodash-es/get';

import getCompiledProjects from './getCompiledProjects';

export default createSelector(
  [getCompiledProjects],
  compiledProjects => {
    const mostRecentCompiledProject = compiledProjects.last();
    const title = get(mostRecentCompiledProject, 'title', '');
    return title;
  },
);
