import {createSelector} from 'reselect';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

export default createSelector(
  state => state.get('projects'),
  projects => sortBy(
    values(projects.toJS()),
    project => -project.updatedAt,
  ),
);
