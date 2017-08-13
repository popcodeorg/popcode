import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('projects'),
  projects => projects.
    filter(project => project.updatedAt).
    sortBy(project => -project.updatedAt).
    keySeq().
    toJS(),
);
