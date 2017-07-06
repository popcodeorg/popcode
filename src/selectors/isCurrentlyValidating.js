import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('errors'),
  errors => Boolean(errors.find(error => error.get('state') === 'validating')),
);
