import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('projects').keySeq(),
  keys => keys.toJS(),
);
