import {createSelector} from 'reselect';

export default createSelector(
  (state, {projectKey}) => state.getIn(['projects', projectKey]),
  project => project.toJS(),
);
