import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('errors'),
  errors => errors.toJS(),
);
