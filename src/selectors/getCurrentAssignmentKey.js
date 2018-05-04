import {createSelector} from 'reselect';
import getCurrentProject from './getCurrentProject';

export default createSelector(
  [getCurrentProject],
  (project) => {
    if (project) {
      return project.assignmentKey;
    }
    return null;
  },
);
