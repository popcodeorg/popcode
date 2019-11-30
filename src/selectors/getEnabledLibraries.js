import {createSelector} from 'reselect';

import getCurrentProject from './getCurrentProject';

export default createSelector(
  [getCurrentProject],
  currentProject => currentProject?.enabledLibraries ?? [],
);
