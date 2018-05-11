import {createSelector} from 'reselect';
import sortBy from 'lodash-es/sortBy';
import values from 'lodash-es/values';

export default createSelector(
  state => state.get('projects'),
  projects => sortBy(
    values(projects.toJS()),
    project => -project.updatedAt,
  ),
);
