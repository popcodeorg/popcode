import {createSelector} from 'reselect';

export default createSelector(
  state => state.getIn(['ui', 'notifications']),
  notifications => notifications.valueSeq(),
);
