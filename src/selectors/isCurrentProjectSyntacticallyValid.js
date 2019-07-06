import {createSelector} from 'reselect';

const syntacticallyValidStates = new Set(['passed', 'runtime-error']);

export default createSelector(
  state => state.get('errors'),
  errors =>
    !errors.find(error => !syntacticallyValidStates.has(error.get('state'))),
);
