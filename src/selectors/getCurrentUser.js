import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('user'),
  user => user.toJS(),
);
