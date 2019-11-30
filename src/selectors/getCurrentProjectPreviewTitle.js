import {createSelector} from 'reselect';

import getCompiledProjects from './getCompiledProjects';

export default createSelector(
  [getCompiledProjects],
  compiledProjects => compiledProjects.last()?.title ?? '',
);
