import {createSelector} from 'reselect';
import getCurrentAssignmenttKey from './getCurrentAssignmentKey';
import getAssignments from './getAssignments';

export default createSelector(
  [getCurrentAssignmenttKey, getAssignments],
  (assignmentKey, assignments) => {
    if (assignments.get(assignmentKey)) {
      return assignments.get(assignmentKey).toJS();
    }
    return null;
  },
);
