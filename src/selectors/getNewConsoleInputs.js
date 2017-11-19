import {createSelector} from 'reselect';
import getConsoleHistory from './getConsoleHistory';

export default createSelector(
  [getConsoleHistory],
  inputs => inputs.filter(input => input.status === 'notStarted'),
);
