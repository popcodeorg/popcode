import sortBy from 'lodash-es/sortBy';
import values from 'lodash-es/values';
import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('projects'),
  projects => sortBy(values(projects.toJS()), project => -project.updatedAt),
);
