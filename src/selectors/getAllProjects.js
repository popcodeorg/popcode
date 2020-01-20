import isNil from 'lodash-es/isNil';
import sortBy from 'lodash-es/sortBy';
import values from 'lodash-es/values';
import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('projects'),
  projects =>
    sortBy(values(projects.toJS()), ({updatedAt}) =>
      isNil(updatedAt) ? -Number.MAX_VALUE : -updatedAt,
    ),
);
