import {createSelector} from 'reselect';

export default createSelector(
  [state => state.getIn(['ui', 'workspace', 'columnFlex'])],
  flex => flex.toJS(),
);
